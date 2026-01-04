import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function extractAudio(
  inputPath: string,
  outputPath: string
) {
  const command = `ffmpeg -y -i "${inputPath}" -vn -acodec pcm_s16le -ar 16000 -ac 1 "${outputPath}"`;
  await execAsync(command);
}
