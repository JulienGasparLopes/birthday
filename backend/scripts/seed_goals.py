"""
Seed script: ensures all goals in GOALS list exist in the database.
Matches by participation_type — upserts so goal amounts can be updated by re-running.

Usage (from repo root):
    uv run python -m backend.scripts.seed_goals
"""

from typing import Literal, NamedTuple

from backend.connectors.mongo_connector import MongoConnector

Unit = Literal["liquid", "unit"]


class Goal(NamedTuple):
    participation_type: str
    amount: float
    unit: Unit


GOALS: list[Goal] = [
    Goal("vodka", 1.0, "liquid"),
    Goal("gin", 1.0, "liquid"),
    Goal("rhum blanc", 1.0, "liquid"),
    Goal("rhum ambré", 1.0, "liquid"),
    Goal("triple sec", 1.0, "liquid"),
    Goal("vermouth dry", 1.0, "liquid"),
    Goal("champagne", 3.0, "liquid"),
    Goal("bayley", 1.0, "liquid"),
    Goal("liqueur de pêche", 1.0, "liquid"),
    Goal("curaçao", 1.0, "liquid"),
    Goal("jus de cranberry", 2.0, "liquid"),
    Goal("ananas", 1.0, "liquid"),
    Goal("limonade", 2.0, "liquid"),
    Goal("eau pétillante", 3.0, "liquid"),
    Goal("jus d'abricot", 1.0, "liquid"),
    Goal("tonic", 1.0, "liquid"),
]


def seed_goals() -> None:
    connector = MongoConnector()
    goals_collection = connector.get_collection("goals")

    inserted, updated = 0, 0

    for goal in GOALS:
        doc = {
            "participation_type": goal.participation_type,
            "goal_amount": {"unit": goal.unit, "amount": goal.amount},
        }
        result = goals_collection.update_one(
            {"participation_type": goal.participation_type},
            {"$set": doc},
            upsert=True,
        )
        if result.upserted_id:
            inserted += 1
            print(
                f"  [+] Inserted  {goal.participation_type}: {goal.amount} {goal.unit}"
            )
        elif result.modified_count:
            updated += 1
            print(
                f"  [~] Updated   {goal.participation_type}: {goal.amount} {goal.unit}"
            )
        else:
            print(
                f"  [=] Unchanged {goal.participation_type}: {goal.amount} {goal.unit}"
            )

    print(f"\nDone — {inserted} inserted, {updated} updated.")
    connector.client.close()


if __name__ == "__main__":
    seed_goals()
