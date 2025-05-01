import numpy as np

from fastapi import Request
from sklearn.neighbors import NearestNeighbors

def get_recommended_items(request: Request, user_id):
	db = request.app.database
	items = db.items.find({}).to_list()
	users = db.users.find({}).to_list()
	orders = db.orders.find({}).to_list()
	users_index = { str(user["_id"]): index for index, user in enumerate(users) }
	items_index = { str(item["_id"]): index for index, item in enumerate(items) }

	X = np.zeros([ len(users), len(items) ])

	for order in orders:
		user_index = users_index.get(str(order["user"]))
		if user_index is None: continue

		for item in order["items"]:
			item_index = items_index.get(str(item["product"]))
			if item_index is None: continue
			X[user_index][item_index] = 1

	neigh = NearestNeighbors(metric="cosine")
	neigh.fit(X)

	user_vector = X[users_index[str(user_id)]].reshape(1, -1)
	_, neighbours = neigh.kneighbors(user_vector, n_neighbors=3)

	recommended_items = set()
	# now we have the neighbours (similar users)
	# next step is to find the items they prefer
	for neighbour in neighbours[0][1:]:
		for item_index in range(len(X[neighbour])):
			if X[neighbour][item_index] >= 1:
				recommended_items.add(str(items[item_index]["_id"]))

	return recommended_items

