# AI-First CRM HCP Module

This project is an AI-First Customer Relationship Management (CRM) module tailored for Life Science field representatives to log interactions with Healthcare Professionals (HCPs). It features a flexible interface allowing users to log interactions via a traditional structured form or a conversational AI assistant powered by LangGraph and Groq.

## Features
- **Split-Screen UI**: A structured form on the left and an AI chat assistant on the right.
- **AI-Powered Data Extraction**: Chat with the assistant to log interactions (e.g., "Met Dr. Smith, discussed Product X efficacy, positive sentiment, set follow-up for next week"). The LangGraph agent automatically extracts the entities and updates the database.
- **Form Auto-fill**: The form updates automatically when the AI assistant successfully logs an interaction.
- **6 LangGraph Tools**:
  1. `log_interaction`: Captures and saves interaction data to the database.
  2. `edit_interaction`: Modifies existing logged data based on conversational commands.
  3. `get_hcp_profile`: Retrieves HCP specialty, location, and preferences.
  4. `search_past_interactions`: Searches through historical interactions for a specific HCP.
  5. `list_all_interactions`: Retrieves a complete list of every log in the entire database.
  6. `schedule_follow_up`: Creates a follow-up action or task.
- **Modern Tech Stack**: React, Redux Toolkit, TailwindCSS v4, Python, FastAPI, SQLAlchemy, PostgreSQL, LangGraph, and Groq.

## Project Structure
- `backend/`: Python FastAPI application and LangGraph agent.
- `frontend/`: React Vite application.

## Prerequisites
- Node.js (v18+)
- Python (3.10+)
- Groq API Key
- PostgreSQL running locally

## Setup & Running Locally

### 1. Backend Setup
Navigate to the backend directory, create a virtual environment, and install dependencies.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install fastapi uvicorn pydantic sqlalchemy langgraph groq langchain-groq python-dotenv psycopg2-binary
```

Create a `.env` file in the `backend/` directory and add your Groq API key:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Start the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## How to Test the AI Assistant
Try typing the following commands into the AI Assistant chat box on the right:

1. **Get Profile**: *"Tell me about Dr. Smith"*
2. **Log Interaction**: *"I just met with Dr. Smith. We discussed the new beta blockers. His sentiment was Positive. The outcome was great and the follow-up action is to send him the phase III trial data tomorrow."* (Notice how the form on the left updates automatically).
3. **Search History**: *"What did we discuss with Dr. Patel last time?"*
4. **Schedule Follow-up**: *"Schedule a follow-up with Dr. Sharma to review the onboarding process next Monday."*
5. **Edit Interaction**: *"Actually, change the sentiment of the last interaction with Dr. Smith to Neutral."*
