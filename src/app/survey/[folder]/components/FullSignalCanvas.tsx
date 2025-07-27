"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { sendWaveFile } from "@/serverAction/sendSoundWav";
import { useParams } from 'next/navigation'
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Link from "next/link";
export default function FullSignalCanvas() {
  // Add these refs:
  const [isAnalyseComplete, setIsAnalyseComplete] = useState<boolean>(false)
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

  const [showDialog, setShowDialog] = useState(false);


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
    <div className="w-[200vw] h-full flex">
      {showDialog && (
        <Dialog open={showDialog}>
          <DialogContent className="[&>button]:hidden">
            <DialogHeader>
              <DialogTitle className="text-center flex justify-center items-center">
                Analysing
              </DialogTitle>

              <DialogDescription className="text-center">
                Please wait a minute.
              </DialogDescription>

              <div className="flex items-center justify-center mt-4">
                {/* Spinner + message */}
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-gray-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Analyzing your audio...</span>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
      <div className={` flex flex-col items-center p-6 h-full w-[100vw] ${isAnalyseComplete ? "translate-x-[-100%] invisible" : "translate-x-0 visible"} duration-200 ease-in-out`}>
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
        <div className="flex gap-x-5 pt-4">
          <button
            type="button"
            onClick={() => toggleRecording(false)}
            className=" px-4 py-2 cursor-pointer"
            disabled={!recordState}
          >
            <Image src={`/play-button.svg`} alt="" width={100} height={100} />
          </button>
          <button
            type="button"
            onClick={async () => {
              setShowDialog(true);            // show dialog
              const res  = await sleep(5000);             // wait 5 seconds
              if(res){
                setShowDialog(false);          // hide dialog
              setIsAnalyseComplete(true);    // mark analysis complete
              // await sendWaveFile(fullData, router?.folder as string)
              }
             
            }}
            className=" px-4 py-2 cursor-pointer"
          >
            <Image src={`/record-button.svg`} alt="" width={100} height={100} />
          </button>

          <button
            type="button"
            onClick={() => toggleRecording(true)}
            className=" px-4 py-2 cursor-pointer"
            disabled={recordState}

          >
            <Image src={`/stop-button.svg`} alt="" width={100} height={100} />
          </button>

        </div>
      </div>

      <div className={` flex flex-col items-center p-6 h-full w-[100vw] ${!isAnalyseComplete ? "translate-x-[0] invisible" : "translate-x-[-100%] visible"} duration-200 ease-in-out gap-y-5`}>
        <h2 className="text-2xl mb-4 font-bold max-xs:text-[20px]">
          Analyse result.
        </h2>
        <Progress className="bg-[#caebed] [&>div]:bg-[#58b9bf] [&>div]:rounded-full  w-[40%] h-[2rem] max-xs:w-[65%]" value={30} />
        <h3 className="text-2xl"> 60%</h3>
        <Image src={'/lungs.png'} width={150} height={100} alt="" />

        <div className="flex gap-x-5 pt-4 flex-col py-4 items-center justify-center gap-y-5">
          <h5 className="font-bold text-xl text-red-600"> Abnormal sound detected </h5>
          <p className=""> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod sunt eum praesentium nemo quia id aperiam ipsa in officiis doloribus excepturi quae, ab molestiae facilis officia amet quam deserunt cum?</p>
          <Link href={"/survey"} className="w-[25%] h-[4rem] flex items-center justify-center px-2">
            <Button className="cursor-pointer bg-[#58b9bf]  text-xl "  > Analyse again</Button>
          </Link>
        </div>
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


function sleep(ms: number): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), ms);
  });
}
