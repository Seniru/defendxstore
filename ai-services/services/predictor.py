from datetime import datetime, timedelta
from bson import ObjectId
from sklearn.ensemble import RandomForestRegressor
from fastapi import Request

"""Get item predictions

Get predictions for sales according  to a given frequency.
Frequency is a preprocessed value coming from the upper backend layer which resembles
a time period (1 day, 1 week, 1 month, etc.)
The frequency will be used to segment the orders according to the period.

After segmenting, a regression model could be trained on each segments.
Features such as orderDate (date, month, year), price will be considered when training the model.

After the training, we could simply make predictions to a given date or a date-range
"""
def get_item_predictions(request: Request, frequency, fromDate, toDate):
    db = request.app.database
    time_segments = {}
    price_segments = {}
    orders = db.orders.find({}).sort("orderdate", 1).to_list()

    current_date = orders[0]["orderdate"].replace(hour=0, minute=0, second=0, microsecond=0)
    upper_bound = current_date + timedelta(days=frequency)
    time_segments[current_date.timestamp()] = []
    price_segments[current_date.timestamp()] = 0

    index = 0

    while index < len(orders):
        order = orders[index]
        order_date = order["orderdate"].replace(hour=0, minute=0, second=0, microsecond=0)

        if order_date < upper_bound:
            # year = order["orderdate"].year
            month = order["orderdate"].month
            day = order["orderdate"].day
            weekday = order["orderdate"].weekday()

            for i in order["items"]:
                time_segments[current_date.timestamp()].append([
                    # year,
                    month,
                    day,
                    weekday,
                ])
                price_segments[current_date.timestamp()] += order["price"]
            index += 1
        else:
            current_date = current_date + timedelta(days=frequency)
            upper_bound = current_date + timedelta(days=frequency)
            time_segments[current_date.timestamp()] = []
            price_segments[current_date.timestamp()] = 0

    # prepare the segments into proper matrices to train
    X = []
    y = []

    for segment_time, entries in time_segments.items():
        for entry in entries:
            X.append(entry)
            y.append(price_segments[segment_time])

    regr = RandomForestRegressor()
    regr.fit(X, y)
    
    # make predictions
    predictions = []
    current_date = fromDate
    while current_date <= toDate:
        input_features = [[
            current_date.month,
            current_date.day,
            current_date.weekday()
        ]]
        prediction = regr.predict(input_features)[0]
        predictions.append([
            current_date,
            prediction
        ])
        current_date += timedelta(days=frequency)

    return predictions