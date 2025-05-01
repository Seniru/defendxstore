from fastapi import APIRouter, Request
from typing import Union
from datetime import datetime
from services.predictor import get_item_predictions

router = APIRouter(prefix="/predictions")

@router.get("/items/")
async def item_predictions(
    frequency: int,
    fromDate: Union[None, datetime],
    toDate: Union[None, datetime],
    request: Request
):
    return get_item_predictions(request, frequency, fromDate, toDate)

