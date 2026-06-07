from backend.connectors.mongo_connector import MongoConnector
from backend.services.participations.type_defs import (
    Participation,
    ParticipationAmount,
    Stock,
    User,
)


class ParticipationsService:
    def __init__(self):
        self._participations_repo = MongoConnector().get_collection("participations")

    def get_users(self) -> list[User]:
        users_repo = MongoConnector().get_collection("users")
        return [User(**user) for user in users_repo.find()]

    def get_user_participations(self, user_id: str) -> list[Participation]:
        raw_participations = self._participations_repo.find({"user_id": user_id})
        return [
            Participation(
                id=str(p["_id"]),
                user_id=p["user_id"],
                participation_amount=ParticipationAmount(**p["participation_amount"]),
                participation_type=p["participation_type"],
            )
            for p in raw_participations
        ]

    def set_participation(
        self,
        user_id: str,
        participation_amount: ParticipationAmount,
        participation_type: str,
    ) -> None:
        if participation_amount.amount == 0:
            self._participations_repo.delete_one(
                {"user_id": user_id, "participation_type": participation_type}
            )
            return

        participation_to_insert = Participation(
            id="UNSET",
            user_id=user_id,
            participation_amount=participation_amount,
            participation_type=participation_type,
        )
        result = self._participations_repo.update_one(
            {"user_id": user_id, "participation_type": participation_type},
            {"$set": participation_to_insert.model_dump(exclude={"id"})},
            upsert=True,
        )
        return Participation(
            id=str(result.upserted_id) if result.upserted_id else "EXISTING",
            user_id=user_id,
            participation_amount=participation_amount,
            participation_type=participation_type,
        )

    def remove_participation(self, user_id: str, participation_id: str) -> None:
        self._participations_repo.delete_one(
            {"user_id": user_id, "id": participation_id}
        )

    def get_stocks(self) -> dict[str, Stock]:
        stocks: dict[str, Stock] = {}
        for participation in self._participations_repo.find():
            participation_type = participation["participation_type"]
            participation_amount = ParticipationAmount(
                **participation["participation_amount"]
            )
            if participation_type not in stocks:
                stocks[participation_type] = Stock(
                    participation_type=participation_type,
                    participation_amount=ParticipationAmount(unit="unit", amount=0),
                    goal_amount=ParticipationAmount(unit="unit", amount=0),
                    achieved_amount=ParticipationAmount(unit="unit", amount=0),
                )
            stocks[
                participation_type
            ].participation_amount.amount += participation_amount.amount

        for goal in MongoConnector().get_collection("goals").find():
            goal_participation_type = goal["participation_type"]
            goal_amount = ParticipationAmount(**goal["goal_amount"])
            if goal_participation_type not in stocks:
                stocks[goal_participation_type] = Stock(
                    participation_type=goal_participation_type,
                    participation_amount=ParticipationAmount(unit="unit", amount=0),
                    goal_amount=goal_amount,
                    achieved_amount=ParticipationAmount(unit="unit", amount=0),
                )
            else:
                stocks[goal_participation_type].goal_amount = goal_amount

        return stocks
