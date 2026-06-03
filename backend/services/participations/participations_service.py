from backend.connectors.mongo_connector import MongoConnector
from backend.services.participations.type_defs import Participation, ParticipationAmount


class ParticipationsService:
    def __init__(self):
        self._participations_repo = MongoConnector().get_collection("participations")

    def get_user_participations(self, user_id: str) -> list[Participation]:
        raw_participations = self._participations_repo.find({"user_id": user_id})
        return [Participation(**p) for p in raw_participations]

    def add_participation(
        self,
        user_id: str,
        participation_amount: ParticipationAmount,
        participation_type: str,
    ) -> Participation:
        participation_to_insert = Participation(
            id="UNSET",
            user_id=user_id,
            participation_amount=participation_amount,
            participation_type=participation_type,
        )
        result = self._participations_repo.insert_one(
            participation_to_insert.model_dump(exclude={"id"})
        )
        return Participation(
            id=str(result.inserted_id),
            user_id=user_id,
            participation_amount=participation_amount,
            participation_type=participation_type,
        )

    def remove_participation(self, user_id: str, participation_id: str) -> None:
        self._participations_repo.delete_one(
            {"user_id": user_id, "id": participation_id}
        )

    def get_stocks(self) -> dict[str, float]:
        stocks = {}
        for participation in self._participations_repo.find():
            participation_type = participation["participation_type"]
            amount = participation["participation_amount"]["amount"]
            if participation_type not in stocks:
                stocks[participation_type] = 0
            stocks[participation_type] += amount
        return stocks
