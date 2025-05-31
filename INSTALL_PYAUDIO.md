# Installing PyAudio on Windows

PyAudio can be difficult to install on Windows because it requires compilation. Here are alternative methods to install it:

## Method 1: Using pip with pre-compiled wheels

The easiest way to install PyAudio on Windows is to use pre-compiled wheels from an unofficial repository:

```
pip install pipwin
pipwin install pyaudio
```

## Method 2: Using a direct wheel download

You can download a pre-compiled wheel directly from the Unofficial Windows Binaries for Python Extension Packages:

1. Go to https://www.lfd.uci.edu/~gohlke/pythonlibs/#pyaudio
2. Download the appropriate wheel file for your Python version and system architecture
   (e.g., PyAudio‑0.2.13‑cp310‑cp310‑win_amd64.whl for Python 3.10 on 64-bit Windows)
3. Install the downloaded wheel:
   ```
   pip install C:\path\to\downloaded\PyAudio‑0.2.13‑cp310‑cp310‑win_amd64.whl
   ```

## Method 3: Alternative Voice Input

If you're unable to install PyAudio, you can modify the agent code to use text input only:

1. Open `agent.py` or `multi_api_agent.py`
2. Set `self.current_mode = "text"` in the `__init__` method
3. Avoid switching to voice mode

## Method 4: Using Conda

If you're using Anaconda or Miniconda:

```
conda install pyaudio
```

After installing PyAudio using one of these methods, you can continue with the rest of the installation:

```
pip install -r requirements.txt
```
