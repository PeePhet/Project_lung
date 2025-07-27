export function encodeWav16bit(samples: number[], sampleRate = 44100): Uint8Array {
  const buffer = new ArrayBuffer(44 + samples.length * 2); // 2 bytes per sample
  const view = new DataView(buffer);

  const writeString = (view: DataView, offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);

  // Convert 0-255 samples to -1.0 to 1.0 then to 16-bit
  for (let i = 0; i < samples.length; i++) {
    const sample = (samples[i] - 128) / 128; // Normalize
    const s16 = Math.max(-1, Math.min(1, sample)) * 32767;
    view.setInt16(44 + i * 2, s16, true);
  }

  return new Uint8Array(buffer);
}
