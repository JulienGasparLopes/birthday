from typing import Any

from flask import Flask, request
from flask_cors import CORS

from backend.connectors.mongo_connector import MongoConnector
from backend.services.participations.participations_service import ParticipationsService
from backend.services.participations.type_defs import ParticipationAmount

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Welcome to the API !</p>"


@app.route("/users", methods=["GET"])
def get_all_users() -> list[dict[str, Any]]:
    mongo_connector = MongoConnector()
    users_collection = mongo_connector.get_collection("users")
    users = list(users_collection.find())
    mongo_connector.client.close()

    return [
        {
            "id": str(user["_id"]),
            "name": user["name"],
        }
        for user in users
    ]


@app.route("/participations/add", methods=["POST"])
def add_participation() -> None:
    request_data = request.get_json()
    participations_service = ParticipationsService()
    participations_service.set_participation(
        user_id=request_data["user_id"],
        participation_amount=ParticipationAmount(
            amount=request_data["participation_amount"],
            unit=request_data["participation_unit"],
        ),
        participation_type=request_data["participation_type"],
    )


@app.route("/participations/stocks", methods=["GET"])
def get_stocks():
    participations_service = ParticipationsService()
    return {k: s.model_dump() for k, s in participations_service.get_stocks().items()}


@app.route("/participations/user/<user_id>", methods=["GET"])
def get_user_participations(user_id: str):
    participations_service = ParticipationsService()
    participations = participations_service.get_user_participations(user_id)
    return [p.model_dump() for p in participations]
