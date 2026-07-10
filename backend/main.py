import os
from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv

import models
from database import engine, get_db, SessionLocal
from schemas import InteractionCreate, InteractionResponse, ChatMessage
from agent import get_agent

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI-First CRM HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_agent_instance():
    try:
        return get_agent()
    except Exception as e:
        print("Failed to init agent:", e)
        return None

@app.post("/api/chat")
async def chat_with_agent(chat_msg: ChatMessage):
    agent = get_agent_instance()
    if not agent:
         raise HTTPException(status_code=500, detail="Agent initialization failed. Check your API key.")
         
    messages_input = []
    for msg in chat_msg.history:
        if msg.get("sender") == "user":
            messages_input.append(("user", msg.get("text", "")))
        elif msg.get("sender") == "ai":
            # Strip the LOGGED_INTERACTION flag from the history so it doesn't confuse the model
            text = msg.get("text", "").replace("LOGGED_INTERACTION", "").strip()
            messages_input.append(("assistant", text))
            
    messages_input.append(("user", chat_msg.message))
    
    try:
        response = agent.invoke({"messages": messages_input})
        
        new_messages = response["messages"][len(messages_input):]
        tool_was_called = any(
            m.__class__.__name__ == "ToolMessage" and getattr(m, "name", "") in ["log_interaction", "edit_interaction"]
            for m in new_messages
        )
        
        last_message = response["messages"][-1].content
        if tool_was_called:
            last_message += " LOGGED_INTERACTION"
            
        return {"response": last_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interactions", response_model=InteractionResponse)
def create_interaction(interaction: InteractionCreate, db: Session = Depends(get_db)):
    db_interaction = models.Interaction(**interaction.dict())
    db.add(db_interaction)
    db.commit()
    db.refresh(db_interaction)
    return db_interaction

@app.get("/api/interactions", response_model=list[InteractionResponse])
def get_interactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    interactions = db.query(models.Interaction).order_by(models.Interaction.id.desc()).offset(skip).limit(limit).all()
    return interactions

@app.get("/api/interactions/latest", response_model=InteractionResponse)
def get_latest_interaction(db: Session = Depends(get_db)):
    interaction = db.query(models.Interaction).order_by(models.Interaction.id.desc()).first()
    if not interaction:
        raise HTTPException(status_code=404, detail="No interactions found")
    return interaction

# Add some mock HCPs for testing if empty
def seed_hcps():
    db = SessionLocal()
    if db.query(models.HCP).count() == 0:
        db.add_all([
            models.HCP(name="Dr. Smith", specialty="Cardiology", location="NY Hospital", preferences="Prefers morning meetings. Interested in new beta blockers."),
            models.HCP(name="Dr. Sharma", specialty="Oncology", location="SF Medical Center", preferences="Always wants clinical trial data."),
            models.HCP(name="Dr. Patel", specialty="Neurology", location="Chicago Clinic", preferences="Prefers emails over visits.")
        ])
        db.commit()
    db.close()

seed_hcps()
