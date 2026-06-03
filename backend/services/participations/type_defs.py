from typing import Literal

from pydantic import BaseModel


class ParticipationAmount(BaseModel):
    unit: Literal["liquid", "unit"]
    amount: float


class Participation(BaseModel):
    id: str
    user_id: str
    participation_amount: ParticipationAmount
    participation_type: Literal["vodka", "gin", "champagne", "chips", "other"]
