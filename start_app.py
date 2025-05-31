import os
import subprocess
import sys
import time
import webbrowser
from threading import Thread

def start_api_server():
    print("Starting API server...")
    api_process = subprocess.Popen(
        [sys.executable, "api_server.py"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for the API server to start
    time.sleep(2)
    
    if api_process.poll() is not None:
        print("Error starting API server:")
        print(api_process.stderr.read())
        return None
    
    print("API server running at http://localhost:8000")
    return api_process

def start_frontend():
    print("\nStarting frontend development server...")
    os.chdir("frontend")
    
    # Check if node_modules exists, if not inform user to run npm install
    if not os.path.exists("node_modules"):
        print("\nNode modules not found. Please run the following commands:")
        print("cd frontend")
        print("npm install")
        print("npm run dev")
        return None
    
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for the frontend server to start
    time.sleep(5)
    
    if frontend_process.poll() is not None:
        print("Error starting frontend server:")
        print(frontend_process.stderr.read())
        return None
    
    print("Frontend server running at http://localhost:3000")
    return frontend_process

def main():
    print("=== Starting Unified AI Agent Application ===")
    
    # Start API server
    api_process = start_api_server()
    
    if api_process:
        # Start frontend server
        frontend_process = start_frontend()
        
        if frontend_process:
            print("\nOpening application in browser...")
            webbrowser.open("http://localhost:3000")
            
            print("\nPress Ctrl+C to stop the servers")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                print("\nStopping servers...")
                frontend_process.terminate()
                api_process.terminate()
                print("Servers stopped.")
        else:
            # If frontend failed to start, stop the API server
            api_process.terminate()

if __name__ == "__main__":
    main()
