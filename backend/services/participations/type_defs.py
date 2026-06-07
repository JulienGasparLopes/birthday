from typing import Literal

from pydantic import BaseModel


class User(BaseModel):
    id: str
    name: str


class ParticipationAmount(BaseModel):
    unit: Literal["liquid", "unit"]
    amount: float


class Participation(BaseModel):
    id: str
    user_id: str
    participation_amount: ParticipationAmount
    participation_type: str


class Stock(BaseModel):
    participation_type: str
    participation_amount: ParticipationAmount
    goal_amount: ParticipationAmount
    achieved_amount: ParticipationAmount
