import { Segment } from "../types";

export function toSRT(segments: Segment[]): string {
  return segments
    .map((s, i) => {
      return `${i + 1}
${formatTime(s.start)} --> ${formatTime(s.end)}
${s.speaker}: ${s.text}

`;
    })
    .join("");
}

function formatTime(sec: number): string {
  const date = new Date(sec * 1000).toISOString().substr(11, 12);
  return date.replace(".", ",");
}
