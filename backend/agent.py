from langgraph.prebuilt import create_react_agent
from langchain_groq import ChatGroq
from tools import tools_list
import os

def get_agent():
    llm = ChatGroq(
        model="gemma2-9b-it",
        temperature=0.0
    )
    
    system_message = """You are a specialized AI assistant for Life Science field representatives using a CRM.
Your primary role is to help log interactions with Healthcare Professionals (HCPs).
You can extract information from the user's natural language and use the `log_interaction` tool to save it.
If the user wants to update something, use the `edit_interaction` tool.
When asked to list or display past interactions, ALWAYS format the data nicely as a Markdown table.
Always be professional and helpful.
Do NOT output raw XML tags or <function> blocks in your conversational text. If you want to use a tool, use the native tool calling API. If you cannot use a tool, do not invent one.
    """
    
    agent_executor = create_react_agent(llm, tools_list, prompt=system_message)
    return agent_executor
