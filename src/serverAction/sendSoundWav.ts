"use server"

import connect from "@/lib/db";
import User from "@/models/user";
import { encodeWav16bit } from "@/utils/encodeWav";

export async function sendWaveFile(data: number[], symtoms: string, userId: string) {
  try {
    // Ensure it is converted to Uint8Array
    const wavBytes = encodeWav16bit(data);
    const blob = new Blob([wavBytes], { type: "audio/wav" });
    const formData = new FormData();
    formData.append("file", blob, "audio.wav");
    // formData.append("symtoms", symtoms);

    const response = await fetch("https://92fc1138afc7.ngrok-free.app/predict/", {
      method: "POST",
      body: formData,
    });

    // Debug response details
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    console.log("Response ok:", response.ok);

    // Check if response has content
    const responseText = await response.text();
    console.log("Raw response text:", responseText);
    console.log("Response text length:", responseText.length);

    // Check if response is empty
    if (!responseText || responseText.trim() === '') {
      console.warn("Empty response body");
      return null;
    }

    // Try to parse JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      console.error("Response was not valid JSON:", responseText);
      return null;
    }

    console.log("Parsed result:", result);

    // Check result status
    if (result.status !== "success") {
      console.warn("API returned non-success status:", result.status);
      return null;
    }

    return result;

  } catch (error) {
    console.error("Network or other error:", error);
    return null;
  }
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
