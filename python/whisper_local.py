# This python script transcribes an audio file using OpenAI's Whisper model locally and  is running as child process from index.ts

import sys
import json
import whisper
import contextlib
import io

audio_path = sys.argv[1]

with contextlib.redirect_stdout(io.StringIO()):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path, verbose=False)

output = {
    "text": result["text"],
    "segments": [
        {
            "start": s["start"],
            "end": s["end"],
            "text": s["text"].strip()
        }
        for s in result["segments"]
    ]
}


print(json.dumps(output))
