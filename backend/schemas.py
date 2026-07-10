from pydantic import BaseModel
from typing import Optional

class InteractionCreate(BaseModel):
    hcp_name: Optional[str] = ""
    interaction_type: Optional[str] = "Meeting"
    interaction_date: Optional[str] = ""
    interaction_time: Optional[str] = ""
    attendees: Optional[str] = ""
    topics_discussed: Optional[str] = ""
    materials_shared: Optional[str] = ""
    samples_distributed: Optional[str] = ""
    sentiment: Optional[str] = ""
    outcomes: Optional[str] = ""
    follow_up_actions: Optional[str] = ""

class InteractionResponse(InteractionCreate):
    id: int

    class Config:
        from_attributes = True

class ChatMessage(BaseModel):
    message: str
    history: list = []
