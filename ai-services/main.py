import json
import os

from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient

from routers import trends, recommendations, predictions

config = dotenv_values(".env")

app = FastAPI()

@app.on_event("startup")
def startup_db_client():
    env = os.environ.get("NODE_ENV")
    print(f"Environment: {env}")
    mongo_uri = "mongodb://localhost/defendx_test" if env == "test" else config.get("MONGO_URI") or os.environ.get("MONGO_URI")
    db_name = config.get("DB_NAME") or os.environ.get("DB_NAME")

    app.mongodb_client = MongoClient(mongo_uri)
    app.database = app.mongodb_client[db_name]
    print(f"Connected to MongoDB database: {db_name}")


@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(trends.router)
app.include_router(recommendations.router)
app.include_router(predictions.router)

@app.get("/")
def read_root():
    return json.dumps(app.database["items"].find().to_list(), default=str)

