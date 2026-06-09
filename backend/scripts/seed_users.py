"""
Seed script: ensures all users in USERS list exist in the database.
Matches by name — inserts if not found, skips if already present.

Usage (from repo root):
    uv run python -m backend.scripts.seed_users
"""

from backend.connectors.mongo_connector import MongoConnector

USERS = [
    "Alexia B",
    "Alexia L",
    "Anaïs",
    "Antoine",
    "Diane",
    "Farouk",
    "Jeanne",
    "Jo",
    "Julian",
    "Mathieu D",
    "Mathieu L",
    "Lucie",
    "Renan",
    "Quentin",
    "Margaux G",
    "Margaux <3",
    "Nicolas Ooow",
    "Octave",
    "Stéphane",
    "Pierre",
    "Marine",
    "Mon Dieu",
    "Violaine",
    "Loïc",
    "Le Z",
    "Alexis",
]


def seed_users() -> None:
    connector = MongoConnector()
    users_collection = connector.get_collection("users")

    existing_names = {u["name"] for u in users_collection.find({}, {"name": 1})}

    to_insert = [{"name": name} for name in USERS if name not in existing_names]

    if to_insert:
        result = users_collection.insert_many(to_insert)
        print(
            f"Inserted {len(result.inserted_ids)} new user(s): {[u['name'] for u in to_insert]}"
        )
    else:
        print("All users already present — nothing to insert.")

    connector.client.close()


if __name__ == "__main__":
    seed_users()
