"use server"

import connect from "@/lib/db";
import User from "@/models/user";
import { encodeWav16bit } from "@/utils/encodeWav";

export async function sendWaveFile(data: number[], symtoms: string , userId :string
) {
  // Ensure it is converted to Uint8Array
  const wavBytes = encodeWav16bit(data);
  const blob = new Blob([wavBytes], { type: "audio/wav" });
  const formData = new FormData();
  formData.append("file", blob, "audio.wav");
  // formData.append("symtoms", symtoms);
  const response = await fetch("https://e2b7e0e5eedd.ngrok-free.app/predict/", {
    method: "POST",
    body: formData,
  });
  const result = await response.json();
  if(result.status != "success") return
  return result;
}

export async function addSymptomToUser(user_id: string, symptom: string, result_msg: string) {
  await connect();

  const result = await User.findOneAndUpdate(
    { _id: user_id },  // 🔥 fixed here
    {
      $push: {
        symptoms: {
          symptom,
          result: result_msg,
          date: new Date(), // auto timestamp
        },
      },
    },
    { new: true } // return updated document
  );

  if (!result) {
    throw new Error("User not found");
  }

  return result;
}
