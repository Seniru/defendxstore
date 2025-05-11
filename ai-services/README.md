# AI services

This service contains everything that is required to find trends, recommendations and make predications.

## Setting up

You need python to run this service. First you need to create a virtual environment. Check this [guide](https://docs.python.org/3/library/venv.html) on how to create and activate virtual environments. After creating the virtual environment issue the following commands to install all the dependencies.

```bash
# install dependencies
python -m pip install -r requirements.txt
```

If the above step throws an error for some reason, you will have to install the following dependencies manually:
```bash
python -m pip install "fastapi[all]", pymongo, numpy, scikit-learn
```

Then create the `.env` file in this directory with the following content

```bash
MONGO_URI="mongodb://127.0.0.1:27017/defendxstore?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.7"
DB_NAME=dbname
```

- `MONGO_URI`: The MongoDB connection URL. Use the one given in the above example if you are running the database in the **local** environment.
If you are using MongoDB with **MongoDB Atlas** use the provided by them instead.

## Running the service
Issue `fastapi dev` command to start the service
