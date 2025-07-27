"use server";

import { encodeWav16bit } from "@/utils/encodeWav";

export async function sendWaveFile(data: number[], symtoms: string) {
  // Ensure it is converted to Uint8Array
  const wavBytes = encodeWav16bit(data);
  const blob = new Blob([wavBytes], { type: "audio/wav" });
  const formData = new FormData();
  formData.append("file", blob, "audio.wav");
  formData.append("symtoms", symtoms);
  console.log(formData.get("file"))
  const response = await fetch("http://localhost:3000/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  console.log("Upload result:", result);
  return result;
}
