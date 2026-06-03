from pymongo import MongoClient
from pymongo.collection import Collection


class MongoConnector:
    def __init__(self) -> None:
        username = "birthday"
        password = "birthday123456dev"
        uri = f"mongodb+srv://{username}:{password}@pinzencluster.wjo3i.mongodb.net/?appName=PinzenCluster"

        self.client = MongoClient(uri)
        self.database = self.client.get_database("birthday")

    def get_collection(self, collection_name) -> Collection:
        return self.database.get_collection(collection_name)
