import os
import json
import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import shutil
from pathlib import Path

# Import the unified agent
from unified_agent import UnifiedAgent
from document_processor import DocumentProcessor
from vector_memory import VectorMemory

# Initialize FastAPI app
app = FastAPI(title="Unified AI Agent API")

# Add CORS middleware to allow the frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the agent
agent = UnifiedAgent()

# Create uploads directory if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Models for request/response
class MessageRequest(BaseModel):
    message: str

class MessageResponse(BaseModel):
    response: str

class MemoryItem(BaseModel):
    content: str
    tags: List[str] = []

class MemoryUpdateItem(BaseModel):
    content: str
    tags: List[str] = []

class SettingsUpdate(BaseModel):
    api_key: Optional[str] = None
    model: Optional[str] = None
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    enable_vector_memory: Optional[bool] = None
    enable_document_processing: Optional[bool] = None
    max_memory_items: Optional[int] = None

# Routes
@app.get("/")
async def read_root():
    return {"message": "Unified AI Agent API is running"}

# Chat endpoints
@app.post("/api/chat", response_model=MessageResponse)
async def chat(request: MessageRequest):
    try:
        # Process the message through the unified agent
        response = agent.process_message(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Document endpoints
@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        file_path = uploads_dir / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the document based on its type
        if file.filename.lower().endswith(".pdf"):
            text = agent.document_processor.extract_text_from_pdf(str(file_path))
        elif file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif")):
            text = agent.document_processor.perform_ocr(str(file_path))
        else:
            # For other document types, try to read as text
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        
        # Create a document record
        document_id = str(hash(file.filename + str(os.path.getmtime(file_path))))
        document = {
            "id": document_id,
            "name": file.filename,
            "path": str(file_path),
            "size": os.path.getsize(file_path),
            "type": get_file_type(file.filename),
            "uploadDate": str(os.path.getctime(file_path)),
            "content": text[:1000] + ("..." if len(text) > 1000 else "")  # Truncate for preview
        }
        
        # Save document metadata
        save_document_metadata(document)
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents")
async def get_documents():
    try:
        documents = load_documents_metadata()
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/documents/{document_id}")
async def get_document(document_id: str):
    try:
        documents = load_documents_metadata()
        document = next((doc for doc in documents if doc["id"] == document_id), None)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Get full content if requested
        file_path = document["path"]
        if os.path.exists(file_path):
            if file_path.lower().endswith(".pdf"):
                document["content"] = agent.document_processor.extract_text_from_pdf(file_path)
            elif file_path.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".gif")):
                document["content"] = agent.document_processor.perform_ocr(file_path)
            else:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    document["content"] = f.read()
        
        return document
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/documents/{document_id}")
async def delete_document(document_id: str):
    try:
        documents = load_documents_metadata()
        document = next((doc for doc in documents if doc["id"] == document_id), None)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Remove the file
        file_path = document["path"]
        if os.path.exists(file_path):
            os.remove(file_path)
        
        # Update metadata
        documents = [doc for doc in documents if doc["id"] != document_id]
        save_documents_metadata(documents)
        
        return {"message": "Document deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Memory endpoints
@app.get("/api/memories")
async def get_memories(tag: Optional[str] = None):
    try:
        memories = agent.get_memories(tag)
        return memories
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memories")
async def add_memory(memory: MemoryItem):
    try:
        memory_id = agent.add_memory(memory.content, memory.tags)
        return {"id": memory_id, "message": "Memory added successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/memories/{memory_id}")
async def update_memory(memory_id: str, memory: MemoryUpdateItem):
    try:
        success = agent.update_memory(memory_id, memory.content, memory.tags)
        if not success:
            raise HTTPException(status_code=404, detail="Memory not found")
        return {"message": "Memory updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/memories/{memory_id}")
async def delete_memory(memory_id: str):
    try:
        success = agent.delete_memory(memory_id)
        if not success:
            raise HTTPException(status_code=404, detail="Memory not found")
        return {"message": "Memory deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memories/search")
async def search_memories(query: str):
    try:
        results = agent.search_memories(query)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Settings endpoints
@app.get("/api/settings")
async def get_settings():
    try:
        # Get settings from config or agent
        settings = {
            "api_key": "*****",  # Masked for security
            "model": agent.model if hasattr(agent, "model") else "openai/gpt-4",
            "user_name": agent.user_info.get("name", "") if hasattr(agent, "user_info") else "",
            "user_email": agent.user_info.get("email", "") if hasattr(agent, "user_info") else "",
            "enable_vector_memory": True,
            "enable_document_processing": True,
            "max_memory_items": 100,
        }
        return settings
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/settings")
async def update_settings(settings: SettingsUpdate):
    try:
        # Update settings in config or agent
        if settings.api_key and settings.api_key != "*****":
            # Update API key in config
            pass
        
        if settings.model:
            # Update model preference
            if hasattr(agent, "model"):
                agent.model = settings.model
        
        if settings.user_name or settings.user_email:
            # Update user info
            if hasattr(agent, "user_info"):
                if settings.user_name:
                    agent.user_info["name"] = settings.user_name
                if settings.user_email:
                    agent.user_info["email"] = settings.user_email
        
        # Other settings can be implemented similarly
        
        return {"message": "Settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def get_file_type(filename):
    extension = filename.split('.')[-1].lower()
    if extension == 'pdf':
        return 'pdf'
    elif extension in ['jpg', 'jpeg', 'png', 'gif', 'bmp']:
        return 'image'
    else:
        return 'document'

def load_documents_metadata():
    metadata_path = Path("document_metadata.json")
    if metadata_path.exists():
        with open(metadata_path, "r") as f:
            return json.load(f)
    return []

def save_document_metadata(document):
    documents = load_documents_metadata()
    # Check if document already exists
    existing_index = next((i for i, doc in enumerate(documents) if doc["id"] == document["id"]), None)
    
    if existing_index is not None:
        documents[existing_index] = document
    else:
        documents.append(document)
    
    save_documents_metadata(documents)

def save_documents_metadata(documents):
    metadata_path = Path("document_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(documents, f, indent=2)

# Run the server
if __name__ == "__main__":
    uvicorn.run("api_server:app", host="0.0.0.0", port=8000, reload=True)
