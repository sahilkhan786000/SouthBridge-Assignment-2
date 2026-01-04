import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function transcribeLocal(audioPath: string) {
  const { stdout } = await execFileAsync(
    "python",
    ["python/whisper_local.py", audioPath],
    {
      maxBuffer: 20 * 1024 * 1024 
    }
  );

  return JSON.parse(stdout);
}
