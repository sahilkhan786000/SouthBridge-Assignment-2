import fs from "fs/promises";
import { extractAudio } from "./audio/extractAudio";
import { transcribeLocal } from "./transacription/whisper";
import { diarize } from "./diarization/llmDiarize";
import { toSRT } from "./output/srt";
import { toMarkdown } from "./output/md";
import { createRunDir, saveJSON } from "./storage/runStore";
import { Segment } from "./types";
import { log, success } from "./utils/logger";

export async function runPipeline(
  inputPath: string,
  format: "srt" | "md"
) {
  log("Starting transcription pipeline");

  // This section is to create run directory
  const runDir = await createRunDir();
  log(`Run directory created: ${runDir}`);

  // This is for Extract audio
  const audioPath = `${runDir}/input.wav`;
  log("Extracting audio using ffmpeg");
  await extractAudio(inputPath, audioPath);
  success("Audio extracted");

  // This is for Transcribe using local Whisper (running as Python script)
  log("Running local Whisper transcription (Python)");
  const whisperResult = await transcribeLocal(audioPath);
  await saveJSON(`${runDir}/whisper_raw.json`, whisperResult);
  success("Transcription completed");

  if (!whisperResult.segments) {
    throw new Error("Whisper did not return segments");
  }

  // This is to Normalize segments
  log("Normalizing transcription segments");
  const segments: Segment[] = whisperResult.segments.map((s: any) => ({
    start: s.start,
    end: s.end,
    text: s.text
  }));

  // This is for Diarization
  log("Running LLM-based speaker diarization");
  const diarized = await diarize(segments, runDir);
  await saveJSON(`${runDir}/final_segments.json`, diarized);
  success("Speaker diarization completed");

  // Final Output generation
  if (format === "srt") {
    log("Generating SRT output");
    await fs.writeFile(`${runDir}/output.srt`, toSRT(diarized));
    success("SRT file generated");
  }

  if (format === "md") {
    log("Generating Markdown output");
    await fs.writeFile(`${runDir}/output.md`, toMarkdown(diarized));
    success("Markdown file generated");
  }

  success(`Pipeline finished successfully. Output saved in ${runDir}`);
}
