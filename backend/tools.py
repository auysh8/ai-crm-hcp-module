from langchain_core.tools import tool
from database import SessionLocal
import models
import json

@tool
def log_interaction(hcp_name: str, topics_discussed: str, sentiment: str, interaction_date: str, outcomes: str = "", follow_up_actions: str = "") -> str:
    """Logs a new interaction into the CRM system. Call this when the user wants to record a meeting or interaction. interaction_date must be in YYYY-MM-DD format (e.g., 2026-07-09)."""
    db = SessionLocal()
    try:
        new_interaction = models.Interaction(
            hcp_name=hcp_name,
            topics_discussed=topics_discussed,
            sentiment=sentiment,
            interaction_date=interaction_date,
            outcomes=outcomes,
            follow_up_actions=follow_up_actions
        )
        db.add(new_interaction)
        db.commit()
        db.refresh(new_interaction)
        
        return json.dumps({
            "status": "success",
            "message": f"Successfully logged interaction with {hcp_name}",
            "interaction_id": new_interaction.id,
            "data": {
                "hcp_name": new_interaction.hcp_name,
                "topics_discussed": new_interaction.topics_discussed,
                "sentiment": new_interaction.sentiment,
                "interaction_date": new_interaction.interaction_date,
                "outcomes": new_interaction.outcomes,
                "follow_up_actions": new_interaction.follow_up_actions
            }
        })
    finally:
        db.close()

@tool
def edit_interaction(interaction_id: str, updates_json: str) -> str:
    """Edits an existing interaction given its ID and a JSON string of updates (e.g. '{"sentiment": "Positive"}')."""
    db = SessionLocal()
    try:
        interaction_id_int = int(interaction_id)
    except ValueError:
        return "Error: interaction_id must be a valid number."
        
    try:
        interaction = db.query(models.Interaction).filter(models.Interaction.id == interaction_id_int).first()
        if not interaction:
            return f"Error: Interaction with ID {interaction_id} not found."
        
        updates = json.loads(updates_json)
        for key, value in updates.items():
            if hasattr(interaction, key):
                setattr(interaction, key, value)
                
        db.commit()
        db.refresh(interaction)
        return f"Successfully updated interaction {interaction_id}."
    except Exception as e:
        return f"Error updating interaction: {str(e)}"
    finally:
        db.close()

@tool
def get_hcp_profile(hcp_name: str) -> str:
    """Retrieves the profile details for a specific HCP to help you understand them better."""
    db = SessionLocal()
    try:
        hcp = db.query(models.HCP).filter(models.HCP.name.ilike(f"%{hcp_name}%")).first()
        if hcp:
            return f"HCP Profile for {hcp.name}:\nSpecialty: {hcp.specialty}\nLocation: {hcp.location}\nPreferences: {hcp.preferences}"
        return f"No profile found for HCP: {hcp_name}. They might be new."
    finally:
        db.close()

@tool
def search_past_interactions(hcp_name: str) -> str:
    """Searches past interactions for a specific HCP."""
    db = SessionLocal()
    try:
        interactions = db.query(models.Interaction).filter(models.Interaction.hcp_name.ilike(f"%{hcp_name}%")).all()
        if not interactions:
            return f"No past interactions found for {hcp_name}."
        
        result = f"Found {len(interactions)} past interactions for {hcp_name}:\n"
        for i in interactions:
            result += f"- [ID: {i.id}] [{i.interaction_date}] Discussed: {i.topics_discussed} (Sentiment: {i.sentiment})\n"
        return result
    finally:
        db.close()

@tool
def list_all_interactions() -> str:
    """Lists all past interactions for all HCPs in the database. Use this when the user asks to see all logs or doesn't specify an HCP."""
    db = SessionLocal()
    try:
        interactions = db.query(models.Interaction).all()
        if not interactions:
            return "No interactions found in the database."
        
        result = f"Found {len(interactions)} total interactions:\n"
        for i in interactions:
            result += f"- [ID: {i.id}] {i.hcp_name} on {i.interaction_date}: {i.topics_discussed} (Sentiment: {i.sentiment})\n"
        return result
    finally:
        db.close()

@tool
def schedule_follow_up(hcp_name: str, task: str, due_date: str) -> str:
    """Schedules a follow-up action for an HCP."""
    db = SessionLocal()
    try:
        new_follow_up = models.FollowUp(hcp_name=hcp_name, task_description=task, due_date=due_date)
        db.add(new_follow_up)
        db.commit()
        return f"Successfully scheduled follow-up for {hcp_name} on {due_date}: {task}"
    finally:
        db.close()

tools_list = [log_interaction, edit_interaction, get_hcp_profile, search_past_interactions, list_all_interactions, schedule_follow_up]
