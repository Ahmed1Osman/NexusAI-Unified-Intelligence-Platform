"""Configuration module for the Voice and Text Agent."""

class Config:
    """Central configuration class for the agent."""
    
    # API Configuration
    OPENROUTER_API_KEY = "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"
    OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
    
    # Model Configuration
    DEFAULT_MODEL = "google/gemini-2.5-pro-preview"
    ALTERNATIVE_MODELS = {
        "gpt": "openai/gpt-3.5-turbo",
        "claude": "anthropic/claude-3-haiku",
        "mistral": "mistralai/mistral-7b-instruct"
    }
    MAX_TOKENS = 500
    TEMPERATURE = 0.7
    
    # Speech Recognition Configuration
    SPEECH_RECOGNITION_TIMEOUT = 5  # seconds
    SPEECH_RECOGNITION_PHRASE_TIMEOUT = 3  # seconds
    
    # Agent Configuration
    SYSTEM_PROMPT = "You are a helpful AI assistant. Provide concise, accurate responses."
    MAX_CONVERSATION_HISTORY = 10  # Maximum number of message pairs to keep
    
    # Logging Configuration
    LOG_LEVEL = "INFO"  # Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
    LOG_FILE = "agent.log"
    ENABLE_RESPONSE_LOGGING = True
    
    # UI Configuration
    CONSOLE_WIDTH = 80
    AGENT_NAME = "AI Assistant"
    USER_NAME = "User"
    
    # Response Cleaning Configuration
    CLEANUP_PATTERNS = [
        "AI feelings", "refined version", "Final check", "*   Polite?",
        "I'm now focused", "I've identified", "I've refined", "I'm trying to",
        "common and effective AI response", "effective AI response", "AI response",
        "I've begun", "I've moved", "I've discarded", "I've experimented",
        "I'm now attempting", "My goal is", "My next step", "This foundational"
    ]
    
    # Feature Flags
    ENABLE_VOICE = True
    ENABLE_TEXT = True
    ENABLE_STREAMING = False  # Future feature for streaming responses
