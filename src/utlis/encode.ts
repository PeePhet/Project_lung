
async function decodeAudioBlob(blob: Blob): Promise<Float32Array> {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext({ sampleRate: 44100 });
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);
  return decoded.getChannelData(0); // mono channel
}



function encodeWav16bit(samples: Float32Array, sampleRate = 44100): Uint8Array {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  const writeUint16 = (offset: number, value: number) => view.setUint16(offset, value, true);
  const writeUint32 = (offset: number, value: number) => view.setUint32(offset, value, true);

  writeString(0, 'RIFF');
  writeUint32(4, 36 + samples.length * 2);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  writeUint32(16, 16);
  writeUint16(20, 1);
  writeUint16(22, 1);
  writeUint32(24, sampleRate);
  writeUint32(28, sampleRate * 2);
  writeUint16(32, 2);
  writeUint16(34, 16);
  writeString(36, 'data');
  writeUint32(40, samples.length * 2);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    offset += 2;
  }

  return new Uint8Array(buffer);
}



export async function convertWebMToWavBlob(webmBlob: Blob): Promise<Blob> {
  // Decode to Float32Array samples
  const samples = await decodeAudioBlob(webmBlob);

  // Encode to WAV Uint8Array
  const wavBytes = encodeWav16bit(samples, 44100); // sampleRate = 44100

  // Convert to Blob
  return new Blob([wavBytes], { type: 'audio/wav' });
}
