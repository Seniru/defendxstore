from fastapi import APIRouter, Request, Query
from typing import Union, List
from datetime import datetime
from services.predictor import get_item_predictions

router = APIRouter(prefix="/predictions")

@router.get("/items/")
async def item_predictions(
    frequency: int,
    fromDate: Union[None, datetime],
    toDate: Union[None, datetime],
    item: str = None,
    request: Request = None
):
    return get_item_predictions(request, frequency, fromDate, toDate, item)

