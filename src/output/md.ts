import { Segment } from "../types";

export function toMarkdown(segments: Segment[]): string {
  return segments
    .map(
      s => `**${s.speaker}** [${s.start.toFixed(2)}s - ${s.end.toFixed(2)}s]  
${s.text}\n`
    )
    .join("\n");
}
