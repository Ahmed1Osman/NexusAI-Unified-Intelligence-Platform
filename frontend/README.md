# Unified AI Agent Frontend

A beautiful and modern React-based frontend for the Unified AI Agent project. This user interface provides a seamless experience for interacting with the AI agent, managing documents, memories, and configuring settings.

## Author

**Ahmed Othman**  
Email: ao9200004@gmail.com

## Features

- **Chat Interface**: Modern chat UI for interacting with the AI agent
- **Document Management**: Upload, view, and manage documents processed by the agent
- **Memory Management**: View and edit the agent's memories
- **Settings**: Configure API keys, model preferences, and application settings
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **React**: Frontend library for building user interfaces
- **Material UI**: Component library for modern design
- **React Router**: For navigation between different sections
- **Vite**: Fast build tool and development server

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
frontend/
├── public/            # Public assets
├── src/
│   ├── assets/        # Images, icons, and other static assets
│   ├── components/    # Reusable UI components
│   ├── pages/         # Main application pages
│   ├── utils/         # Utility functions and mock data
│   ├── App.jsx        # Main application component
│   ├── index.css      # Global styles
│   └── main.jsx       # Application entry point
├── index.html         # HTML template
├── package.json       # Dependencies and scripts
└── vite.config.js     # Vite configuration
```

## Connecting to the Backend

The frontend is designed to connect to the Python-based Unified Agent backend. To configure the connection:

1. Update the API endpoint in the Settings page
2. Enter your OpenRouter API key
3. Select your preferred AI model

## Building for Production

To build the application for production deployment:

```
npm run build
```
or
```
yarn build
```

The built files will be in the `dist` directory, ready to be served by any static file server.

## Future Enhancements

- Real-time notifications
- Dark/light theme toggle
- User authentication
- Advanced document visualization
- Integration with external services

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Developed by **Ahmed Othman** (ao9200004@gmail.com)
