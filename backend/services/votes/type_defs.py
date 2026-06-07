from typing import Literal

from pydantic import BaseModel

EventPart = Literal["apres-midi", "soiree", "nuit", "brunch"]
VoteChoice = Literal["yes", "maybe", "no"]


class Vote(BaseModel):
    user_id: str
    event_part: EventPart
    choice: VoteChoice
