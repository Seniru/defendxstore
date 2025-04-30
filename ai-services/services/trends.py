import json
from datetime import datetime, timedelta

import numpy as np
from sklearn.linear_model import LinearRegression
from fastapi import Request

SALES_LOWER_THRESHOLD = 10

"""Get trending items

The algorithm to find the trending items works as described below.
First we need to retrieve all the orders happened within a recent time (say last week)
Each item in those order will be mapped according to how much sales happened in each day

For example:
	Item 1 -> [ 10, 20, 5, 0, 12, 4, 8 ] # sales performance for a week

After that pre-processing we can train a regression model to find the gradient.
Then the items can be ordered from most to least gradient value.
The gradient value has to be weighed a little by the number of total items sold on the week,
to actually find out which is the most trending with most sales.

"""
def get_trending_items(request: Request):
	now = datetime.now()
	last_week = now - timedelta(days = 7)
	
	orders = request.app.database.orders.find({
		"orderdate": {
			"$gte": last_week,
			"$lt": now
		}
	}).to_list()

	sales_per_item = {}
	item_frequency = {}

	for order in orders:
		date_index = (order["orderdate"] - last_week).days
		for item in order["items"]:
			product_id = item["product"]
			if product_id not in sales_per_item:
				# sales per item for 7 days
				sales_per_item[product_id] = np.zeros(7)
				item_frequency[product_id] = 0
			
			sales_per_item[product_id][date_index] += 1
			item_frequency[product_id] += 1

	item_scores = {}
	for product_id, sales in sales_per_item.items():
		X = np.arange(7).reshape(-1, 1)
		y = sales

		# training the model
		model = LinearRegression()
		model.fit(X, y)
		gradient = model.coef_[0]

		# score using gradient and total sales
		# dividing the item frequency by a lower threshold value acts as a rewarding method
		# if frequency is too low the score will tend to the lower side, and vice versa
		item_scores[str(product_id)] = gradient * (item_frequency[product_id] / SALES_LOWER_THRESHOLD)

		# another way to score
		# item_scores[str(product_id)] = gradient * 0.7 + item_frequency[product_id] * 0.3

		# print(
		# 	sales_per_item[product_id],
		# 	gradient + (item_frequency[product_id] / SALES_LOWER_THRESHOLD),
		# 	gradient * 0.7 + item_frequency[product_id] * 0.3
		# )
	
	return sorted(item_scores.items(), key=lambda x: x[1], reverse=True)[:8]
