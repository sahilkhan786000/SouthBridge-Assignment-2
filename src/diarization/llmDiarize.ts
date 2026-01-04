// import OpenAI from "openai";
// import fs from "fs/promises";
// import { Segment } from "../types";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export async function diarize(
//   segments: Segment[],
//   runDir: string
// ): Promise<Segment[]> {
//   const prompt = await fs.readFile("prompts/diarization.txt", "utf-8");

//   await fs.writeFile(`${runDir}/llm_prompt.txt`, prompt);

//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: prompt },
//       { role: "user", content: JSON.stringify(segments, null, 2) }
//     ]
//   });

//   const content = completion.choices[0].message.content!;
//   await fs.writeFile(`${runDir}/llm_diarization_output.json`, content);

//   return JSON.parse(content);
// }



import OpenAI from "openai";
import fs from "fs/promises";
import { Segment } from "../types";


const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_API_KEY
});

export async function diarize(
  segments: Segment[],
  runDir: string
): Promise<Segment[]> {

  const prompt = await fs.readFile("prompts/diarization.txt", "utf-8");

 
  await fs.writeFile(`${runDir}/llm_prompt.txt`, prompt);

  
  const completion = await client.chat.completions.create({
    model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    messages: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: JSON.stringify(segments, null, 2)
      }
    ],
    temperature: 0.2,
    max_tokens: 2000
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Hugging Face LLM returned empty response");
  }


  await fs.writeFile(
    `${runDir}/llm_diarization_output.json`,
    content
  );

 
  return JSON.parse(content);
}
