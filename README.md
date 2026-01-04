# 🌟 CLI Transcription Agent — TypeScript + Bun

This is a simple CLI-based tool that converts audio or video files into structured transcripts with timestamps and speaker labels.  
The project focuses on clarity, transparency, and explainability rather than building a black-box AI system.

It accepts an audio or video file as input, processes it step by step, and produces readable outputs such as `.srt` or `.md` files.  
All intermediate steps are saved so the full pipeline can be inspected and debugged easily.

---

## 📌 Overview

The goal of this project is to build a clear and understandable transcription and diarization pipeline by combining:
- local speech-to-text using Whisper
- LLM-based speaker diarization
- a simple, inspectable backend flow

Instead of hiding complexity, this tool exposes each stage of the process and makes AI behavior visible and debuggable.

---

## 🏗️ Architecture

The system is designed as a linear pipeline where each step has a single responsibility.

Main components:
- **CLI (Bun + TypeScript)** – entry point and orchestration
- **Audio extraction (ffmpeg)** – converts video/audio into WAV
- **Local Whisper (Python)** – transcription with timestamps
- **LLM Diarization (Hugging Face)** – speaker labeling
- **Output generators** – SRT or Markdown
- **Run storage** – saves all intermediate artifacts

The architecture is intentionally simple and modular so that individual steps can be replaced or extended later.

---

## 🔹 Pipeline Flow



The following flow represents the automated steps taken for every processed file:

```
    A[Input Video / Audio] --> B[ffmpeg: Audio Extraction]
    B --> C[Local Whisper: Python Integration]
    C --> D[Timestamped Segments]
    D --> E[LLM Diarization: Speaker Identification]
    E --> F[Speaker-labeled Segments]
    F --> G[Final Output: SRT / Markdown]
```
Each run creates a timestamped folder containing all intermediate files and outputs.

---

## 🏗️ Folder Structure
.
├── src/
    │   ├── audio/          # ffmpeg audio extraction logic

    │   ├── transcription/  # Local Whisper (Python) integration

    │   ├── diarization/    # LLM-based speaker labeling

    │   ├── output/         # SRT and Markdown format generators

    │   ├── storage/        # Run management and JSON storage

    │   ├── utils/          # Logging and shared helpers

    │   ├── cli.ts          # Command-line interface entry point

    │   └── index.ts        # Main pipeline orchestrator

    │   └── runs/
          └── <timestamp>/ # Contains all intermediate files and final outputs per run


---

## 🤖 LLM Usage

AI is used intentionally and transparently in this project.

### 1. Transcription
- Uses **local Whisper (Python)** instead of an API
- Chosen to avoid API limits, cost issues, and reliability problems
- Produces timestamped text segments

### 2. Diarization
- Uses an **LLM via Hugging Face Router**
- The model assigns speaker labels based on conversational context
- Prompts and raw LLM outputs are saved for inspection

AI is treated as a tool, not a black box. All outputs can be reviewed and validated.

---

## 🔹Challenges Faced & How They Were Resolved

### 1. Whisper API Quota Issues
**Problem:** OpenAI Whisper API returned quota errors.  
**Solution:** Switched to running Whisper locally using Python.

---

### 2. LLM Output Reliability
**Problem:** LLMs can return malformed or unexpected JSON.  
**Solution:** Saved raw outputs, validated structure, and kept diarization isolated from the rest of the pipeline.

---

### 3. Tooling Integration
**Problem:** Running Python-based ML from a TypeScript CLI.  
**Solution:** Used child process execution and file-based communication between TypeScript and Python.

---

### 4. Debugging & Observability
**Problem:** Hard to understand where time was spent or where failures occurred.  
**Solution:** Added structured logging and saved all intermediate artifacts per run.

---

## 🚀 How to Run the Project

### Prerequisites
Bun
Python (with Whisper installed)
ffmpeg available in PATH

### Development
```bash
bun run dev <input-file> --format srt
```

### Build and run
```bash
bun run build
bun ./dist/cli.js <input-file> --format srt
```

---

## 📦 Outputs

Each run creates a folder inside `runs/` containing:

* **extracted audio**
* **raw Whisper output**
* **diarization prompt**
* **raw LLM output**
* **final transcript file**

This makes the full execution trace easy to inspect.

---

## 🔹Limitations

* **Speaker diarization** may be inaccurate for overlapping speakers
* **No confidence scores** are currently generated
* **Manual verification** may still be needed for noisy audio
* **Not optimized** for very large or streaming inputs

---

## 🔹 Future Improvements

Possible extensions include:

* **diarization confidence scoring**
* **fallback diarization strategies**
* **UI wrapper** on top of the CLI
* **streaming transcription**
* **automated evaluation metrics**

## 🤖 AI Use Disclosure (Required by Southbridge Policy)

I used AI tools (ChatGPT) for:

- Drafting parts of the architecture  
- Refining code patterns  
- Debugging  
- Improving this README  

However:

- All code was written, refactored, tested, and verified manually  
- All decisions (architecture, structure, fixes) were made by me  
- No code was blindly copied  

This project is open to feedback and suggestions, and I would be happy to improve or extend it based on any inputs or observations.
