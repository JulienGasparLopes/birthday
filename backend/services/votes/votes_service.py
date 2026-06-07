from backend.connectors.mongo_connector import MongoConnector
from backend.services.votes.type_defs import EventPart, Vote, VoteChoice


class VotesService:
    def __init__(self):
        self._votes_repo = MongoConnector().get_collection("votes")

    def set_vote(self, user_id: str, event_part: EventPart, choice: VoteChoice) -> Vote:
        vote = Vote(user_id=user_id, event_part=event_part, choice=choice)
        self._votes_repo.update_one(
            {"user_id": user_id, "event_part": event_part},
            {"$set": vote.model_dump()},
            upsert=True,
        )
        return vote

    def get_user_votes(self, user_id: str) -> list[Vote]:
        return [Vote(**v) for v in self._votes_repo.find({"user_id": user_id})]

    def get_vote_counts(self) -> dict[str, dict[str, int]]:
        """Returns {event_part: {yes: N, maybe: N, no: N}}"""
        counts: dict[str, dict[str, int]] = {}
        for vote in self._votes_repo.find():
            part = vote["event_part"]
            choice = vote["choice"]
            if part not in counts:
                counts[part] = {"yes": 0, "maybe": 0, "no": 0}
            counts[part][choice] = counts[part].get(choice, 0) + 1
        return counts
