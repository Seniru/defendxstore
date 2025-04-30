import json

from fastapi import FastAPI
from dotenv import dotenv_values
from pymongo import MongoClient

from routers import trends, recommendations

config = dotenv_values(".env")

app = FastAPI()

@app.on_event("startup")
def startup_db_client():
    app.mongodb_client = MongoClient(config["MONGO_URI"])
    app.database = app.mongodb_client[config["DB_NAME"]]
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

app.include_router(trends.router)
app.include_router(recommendations.router)

@app.get("/")
def read_root():
    return json.dumps(app.database["items"].find().to_list(), default=str)

