# routes/recommendations.py
from fastapi import APIRouter, Request
from services.trends import get_trending_items

router = APIRouter(prefix="/trending")

@router.get("/items/")
async def trending_items(request: Request):
    return get_trending_items(request)

