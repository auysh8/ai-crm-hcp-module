from sqlalchemy import Column, Integer, String, Date, Time, Text
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"
    
    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String, index=True)
    interaction_type = Column(String, default="Meeting")
    interaction_date = Column(String)
    interaction_time = Column(String)
    attendees = Column(String)
    topics_discussed = Column(Text)
    materials_shared = Column(Text)
    samples_distributed = Column(Text)
    sentiment = Column(String)
    outcomes = Column(Text)
    follow_up_actions = Column(Text)

class HCP(Base):
    __tablename__ = "hcps"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String)
    location = Column(String)
    preferences = Column(Text)

class FollowUp(Base):
    __tablename__ = "follow_ups"
    
    id = Column(Integer, primary_key=True, index=True)
    hcp_name = Column(String)
    task_description = Column(Text)
    due_date = Column(String)
