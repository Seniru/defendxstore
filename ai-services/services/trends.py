import json

from fastapi import Request

def get_trending_items(request: Request):
	items = request.app.database["items"].find().to_list()
	return json.dumps(items, default=str)