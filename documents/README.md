# Unified Agent

A Python-based agent that combines text processing, memory capabilities, and user information management in a single interface. The agent can process text inputs, generate responses using various AI models, remember important information, and maintain user context.

## Features

- Text-based interaction with multiple AI models
- Memory storage and retrieval system
- User information tracking and management
- Support for multiple AI providers via OpenRouter
- Simple command-line interface

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Create a `.env` file in the project root with your API keys:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. Run the agent:
   ```
   python agent.py
   ```

## Usage

Run the unified agent:
```
python unified_agent.py
```

### Commands

- `!memory` - Memory management commands
  - `!memory add <content>` - Add a new memory
  - `!memory search <query>` - Search memories
  - `!memory tag <id> <tag>` - Add tag to memory
  - `!memory list` - List all memories
- `!user` - User information commands
  - `!user set <key> <value>` - Set user information
  - `!user get <key>` - Get specific user information
  - `!user list` - List all user information
  - `!user clear` - Clear all user information
- `!model` - View or change AI model
  - `!model <name>` - Switch to a specific model (gemini, gpt, claude, mistral, deepseek)
- `!mode` - Change agent mode
  - `!mode <name>` - Switch to a specific mode (chat, memory, info)
- `!api:<name>` - Change text processing API (openrouter, huggingface)
- `!status` - Show current agent status
- `!exit` - Quit the application

## Note

This is a practice project and not intended for business use.
