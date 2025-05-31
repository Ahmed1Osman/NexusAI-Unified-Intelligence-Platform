# NexusAI: Unified Intelligence Platform

<div align="center">
  <img src="screenshots/nexusai_logo.png" alt="NexusAI Logo" width="200">
  <h3>A powerful AI assistant platform with semantic memory and document processing</h3>
</div>

## 🌟 Overview

NexusAI is a comprehensive AI assistant platform that seamlessly integrates multiple advanced technologies into a unified, user-friendly interface. This full-stack application combines modern frontend development with powerful backend AI processing capabilities.

> **Note**: Some core files are not included in this repository for proprietary reasons. If you're interested in the complete codebase for academic or professional purposes, please contact me at ao9200004@gmail.com.

## ✨ Key Features

- **Beautiful Modern UI**: Intuitive React-based interface with Material UI components
- **Advanced AI Interaction**: Connect with multiple AI models via OpenRouter (Gemini, GPT, Claude, etc.)
- **Semantic Memory**: Store and retrieve information using vector embeddings for meaning-based search
- **Document Processing**: Extract text from PDFs and analyze content
- **OCR Capabilities**: Extract text from images using optical character recognition
- **Resume Parsing**: Automatically extract key information from resumes
- **User Information Management**: Track and recall user preferences and details

## 📸 Screenshots

### Chat Interface
<div align="center">
  <img src="screenshots/chat_interface.png" alt="Chat Interface" width="800">
</div>

### Document Management
<div align="center">
  <img src="screenshots/document_management.png" alt="Document Management" width="800">
</div>

### Memory System
<div align="center">
  <img src="screenshots/memory_system.png" alt="Memory System" width="800">
</div>

### Settings Page
<div align="center">
  <img src="screenshots/settings_page.png" alt="Settings Page" width="800">
</div>

## 🛠️ Technology Stack

### Frontend
- **React**: Frontend library for building user interfaces
- **Material UI**: Component library for modern design
- **React Router**: For navigation between different sections
- **Vite**: Fast build tool and development server
- **Axios**: For API requests
- **React Markdown**: For rendering markdown content

### Backend
- **Python**: Core programming language
- **FastAPI**: High-performance web framework
- **Vector Embeddings**: For semantic memory and search
- **Document Processing**: PDF text extraction and analysis
- **OCR**: Optical character recognition for images
- **AI Integration**: OpenAI, Google, Anthropic models support

## 🏗️ Architecture

NexusAI follows a modern client-server architecture:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│  React Frontend ├───────┤  FastAPI Server ├───────┤   AI Services   │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                   │
                                   │
                          ┌────────┴────────┐
                          │                 │
                          │  Vector Memory  │
                          │  & Documents    │
                          │                 │
                          └─────────────────┘
```

## 📁 Project Structure

```
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Main application pages
│   │   └── utils/           # Utility functions
│   └── ...
├── api_server.py            # FastAPI server implementation
├── document_processor.py    # Document processing utilities
├── vector_memory.py         # Semantic memory implementation
└── ...
```

## 🚀 Getting Started

To set up a development environment:

1. Clone this repository
2. Install backend dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env`
4. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```
5. Start the development servers:
   ```
   # Terminal 1: Start API server
   python api_server.py
   
   # Terminal 2: Start frontend
   cd frontend
   npm run dev
   ```

## 🔒 Security Notes

- API keys should be stored in the `.env` file (not included in repo)
- The application uses secure API communication
- User data is stored locally by default

## 🔮 Future Enhancements

- User authentication system
- Cloud synchronization of memories
- Mobile application
- Advanced document visualization
- Integration with additional AI models

## 👨‍💻 Author

**Ahmed Othman**  
Email: ao9200004@gmail.com

## 📄 License

This project is proprietary. Some components are not included in this public repository. For academic or professional inquiries, please contact the author.
