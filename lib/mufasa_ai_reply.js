import fs from "fs";
import path from "path";
import OpenAI from "openai";

// Load your key from env (expo already wires `EXPO_PUBLIC_OPENAI_API_KEY`)
const client = new OpenAI({
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY,
});

// File save location
const outDir = path.resolve(__dirname, "../assets/audio");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

/**
 * Generate Mufasa-style mp3 from text
 * @param {string} text - the AI reply
 * @param {string} fileName - output file name
 * @returns {Promise<string>} - file path to saved mp3
 */
export async function generateMufasaReply(text, fileName = "mufasa_ai_reply.mp3") {
  const outPath = path.join(outDir, fileName);

  const response = await client.audio.speech.create({
    model: "gpt-4o-mini-tts",
    voice: "alloy", // deep male base (closest to Mufasa)
    input: `Hyena Free. ${text}`, // prepend your signature
  });

  // Convert ArrayBuffer → Buffer
  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(outPath, buffer);
  console.log(`✅ Mufasa reply saved: ${outPath}`);

  return outPath;
}