# Unified AI Agent API Server

This API server provides a RESTful interface for the Unified AI Agent, allowing the frontend to communicate with the agent's core functionality.

## Features

- **Chat Endpoints**: Process messages through the unified agent
- **Document Endpoints**: Upload, retrieve, and manage documents
- **Memory Endpoints**: Store, retrieve, and search memories
- **Settings Endpoints**: Configure API keys and agent preferences

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Run the API server:
   ```
   python api_server.py
   ```

   The server will start on http://localhost:8000

## API Endpoints

### Chat

- `POST /api/chat` - Send a message to the agent

### Documents

- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - Get all documents
- `GET /api/documents/{document_id}` - Get a specific document
- `DELETE /api/documents/{document_id}` - Delete a document

### Memories

- `GET /api/memories` - Get all memories
- `POST /api/memories` - Add a new memory
- `PUT /api/memories/{memory_id}` - Update a memory
- `DELETE /api/memories/{memory_id}` - Delete a memory
- `GET /api/memories/search` - Search memories

### Settings

- `GET /api/settings` - Get current settings
- `PUT /api/settings` - Update settings

## Integration with Frontend

The API server is designed to work with the React frontend. To use them together:

1. Start the API server:
   ```
   python api_server.py
   ```

2. In a separate terminal, start the frontend development server:
   ```
   cd frontend
   npm install
   npm run dev
   ```

3. Or use the convenience script to start both:
   ```
   python start_app.py
   ```

## Security

For production use, consider implementing proper authentication and HTTPS.
