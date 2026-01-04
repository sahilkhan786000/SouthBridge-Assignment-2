import fs from "fs/promises";

export async function createRunDir(): Promise<string> {
  const dir = `runs/${new Date().toISOString().replace(/:/g, "-")}`;
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function saveJSON(path: string, data: any) {
  await fs.writeFile(path, JSON.stringify(data, null, 2));
}
