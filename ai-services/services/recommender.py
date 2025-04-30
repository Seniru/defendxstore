import json

from fastapi import Request

def get_recommended_items(request: Request, user_id):
	print(request, user_id)
	items = request.app.database["items"].find().to_list()
	return json.dumps(items, default=str)
