"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sendWaveFile } from "@/serverAction/sendSoundWav";
import { useParams } from 'next/navigation'
export default function FullSignalCanvas() {
  // Add these refs:

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fullData, setFullData] = useState<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafIdRef = useRef<number>(0);
  const allSamplesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number | null>(null); // timestamp when current session started
  const accumulatedTimeRef = useRef(0); // elapsed time in ms before current session
  const intervalRef = useRef<number | null>(null);
  const [timer, setTimer] = useState("00:00:00");
  const [recordState, setRecordState] = useState<boolean>(true)

  const router = useParams()

  const [audioUrl, setAudioUrl] = useState<string | null>(null);

 
  // Handle recording start/stop
  const toggleRecording = async (shouldStop: boolean) => {
    setRecordState(shouldStop)
    if (shouldStop) {
      // Stop recording
      if (startTimeRef.current !== null) {
        accumulatedTimeRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      cancelAnimationFrame(rafIdRef.current);
      audioContextRef.current?.close();
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext({ sampleRate: 44100 });
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      // Store in refs
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;



      startTimeRef.current = Date.now();

      // Start interval to update timer every 1 second
      intervalRef.current = window.setInterval(() => {
        if (startTimeRef.current !== null) {
          const elapsedMs = accumulatedTimeRef.current + (Date.now() - startTimeRef.current);
          setTimer(formatTime(Math.floor(elapsedMs / 10)));
        }
      }, 10);

      draw();
    }
  };

  // Collect audio and draw waveform live
  const draw = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;
    analyser.getByteTimeDomainData(dataArray);
    // Store the data
    allSamplesRef.current.push(...Array.from(dataArray));
    const allData = allSamplesRef.current;
    setFullData(allData)

    // Draw to canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "#00FFAA";
      ctx.beginPath();

      const sliceWidth = canvas.width / dataArray.length;
      let x = 0;

      for (let i = 0; i < dataArray.length; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.stroke();
    }
    // Schedule next frame
    rafIdRef.current = requestAnimationFrame(draw);
  };

  // Cleanup when recording stops (optional but good practice)
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) clearInterval(intervalRef.current);
      cancelAnimationFrame(rafIdRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-6 h-full w-full">
      <h1 className="text-xl mb-4 font-bold space-x-1.5">{timer}</h1>
      <h2 className="text-xl mb-4 font-bold">
        Please put your phone close to your chest and take a deep breath.
      </h2>

      <canvas
        ref={canvasRef}
        width={1000}
        height={250}
        className="rounded-lg shadow w-full"
      />
      <div className="flex gap-x-5">
        <button
          type="button"
          onClick={() => toggleRecording(false)}
          className="mt-4 px-4 py-2 cursor-pointer"
          disabled={!recordState}
        >
          <Image src={`/play-button.svg`} alt="" width={100} height={100} />
        </button>
        <button
          type="button"
          onClick={() => sendWaveFile(fullData, router?.folder as string)}
          className="mt-4 px-4 py-2 cursor-pointer"
        >
          <Image src={`/record-button.svg`} alt="" width={100} height={100} />
        </button>

        <button
          type="button"
          onClick={() => toggleRecording(true)}
          className="mt-4 px-4 py-2 cursor-pointer"
          disabled={recordState}

        >
          <Image src={`/stop-button.svg`} alt="" width={100} height={100} />
        </button>
        
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
}
