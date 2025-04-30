from fastapi import APIRouter, Request
from services.recommender import get_recommended_items

router = APIRouter(prefix="/recommendations")

@router.get("/items/")
async def recommended_items(user_id, request: Request):
    return get_recommended_items(request, user_id)

