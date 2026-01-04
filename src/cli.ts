// This is entry point of the CLI application.


import { cac } from "cac";
import { runPipeline } from "./index";

const cli = cac("meet-scribe");

cli
  .command("<input>", "Transcribe and diarize audio/video")
  .option("--format <type>", "Output format: srt | md", {
    default: "srt"
  })
  .action(async (input, options) => {
    await runPipeline(input, options.format);
  });

cli.help();
cli.parse();
