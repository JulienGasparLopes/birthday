from flask import Flask, request
from pydantic import BaseModel

from backend.connectors.mongo_connector import MongoConnector
from backend.services.participations.participations_service import ParticipationsService
from backend.services.participations.type_defs import ParticipationAmount

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Welcome to the API !</p>"


class User(BaseModel):
    first_name: str
    last_name: str


@app.route("/users", methods=["GET"])
def get_all_users() -> list[User]:
    mongo_connector = MongoConnector()
    users_collection = mongo_connector.get_collection("users")
    users = list(users_collection.find())
    mongo_connector.client.close()

    return [User(**user).model_dump() for user in users]


@app.route("/participations/add", methods=["POST"])
def add_participation():
    request_data = request.get_json()
    print(request_data)
    participations_service = ParticipationsService()
    return participations_service.add_participation(
        user_id=request_data["user_id"],
        participation_amount=ParticipationAmount(
            amount=request_data["participation_amount"],
            unit=request_data["participation_unit"],
        ),
        participation_type=request_data["participation_type"],
    ).model_dump()


@app.route("/participations/remove", methods=["POST"])
def remove_participation():
    pass


@app.route("/participations/stocks", methods=["GET"])
def get_stocks():
    participations_service = ParticipationsService()
    return participations_service.get_stocks()
