"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { addSymptomToUser, sendWaveFile } from "@/serverAction/sendSoundWav";
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
import { convertWebMToWavBlob } from "@/utlis/encode";


type ColdSymptomDetail = {
  title: string;
  description: string;
  possibleDiseases: string[];
};

export default function FullSignalCanvas() {
  // Add these refs:
  const [BlobAudio, setBlobAudio] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [symptomDetail, setSymptomDetail] = useState<ColdSymptomDetail>()
  const [percentProgress, setPercentProgress] = useState<number>(0)
  const [soundDetect, setSoundDetect] = useState<string>("")
  const [symtoms, setSymtoms] = useState<string>("")
  const [isAnalyseComplete, setIsAnalyseComplete] = useState<boolean>(false)
  const [localStr, setLocalStr] = useState<string>("")
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
  
  useEffect(() => {
    const userId = localStorage.getItem("_id");
    setLocalStr(userId || "")
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setBlobAudio(blob);
      chunks.current = [];
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const [showDialog, setShowDialog] = useState(false);

  const coldSymptomAdvice: Record<number, string> = {
    0: ' Seek immediate medical attention. Your symptoms may indicate a serious condition.',
    25: ' Rest well, stay hydrated, and consider over-the-counter medicine. See a doctor if symptoms worsen.',
    50: ' Mild cold symptoms. Monitor your condition, rest, and drink fluids.',
    75: ' You’re nearly recovered. Maintain a healthy diet and stay warm.',
    100: ' You’re in good health. Continue maintaining hygiene and a strong immune system.',
  };


  const coldSymptomLevels: Record<number, string> = {
    0: 'Highly Abnormal',
    25: 'Abnormal',
    50: 'Borderline',
    75: 'Mildly Normal',
    100: 'Normal',
  };

  const coldSymptomDetect: Record<number, string> = {
    0: 'Abnormal sound detected',
    100: 'Normal sound',
  };


  const coldSymptomLevelsDetail: Record<number, {
    title: string;
    description: string;
    possibleDiseases: string[];
  }> = {
    100: {
      title: "Normal",
      description: "No signs of respiratory abnormalities. Breathing is clear and healthy.",
      possibleDiseases: []
    },
    75: {
      title: "Wheeze",
      description: "Mild airway constriction. Wheezing may occur when breathing out.",
      possibleDiseases: ["Mild Asthma", "Early-stage Bronchitis", "Allergic Rhinitis"]
    },
    50: {
      title: "Crackle",
      description: "Crackling or popping sounds in the lungs, often during inhalation.",
      possibleDiseases: ["Bronchitis", "Pneumonia", "Pulmonary Edema"]
    },
    25: {
      title: "Cough",
      description: "Frequent coughing detected. Could be dry or productive.",
      possibleDiseases: ["Upper Respiratory Infection", "Flu", "COVID-19", "Allergy"]
    },
    0: {
      title: "Highly Abnormal",
      description: "Severe respiratory symptoms detected. May involve shortness of breath or chest tightness.",
      possibleDiseases: ["Severe Pneumonia", "COPD", "Advanced Asthma", "COVID-19 (Severe)"]
    },
  };


  function getColdSymptomLevel(score: number): string {
    if (score <= 0) return coldSymptomLevels[0];
    if (score <= 25) return coldSymptomLevels[25];
    if (score <= 50) return coldSymptomLevels[50];
    if (score <= 75) return coldSymptomLevels[75];
    return coldSymptomLevels[100];
  }

  function getColdSymptomDetect(score: number): string {
    if (score < 100) return coldSymptomDetect[0];
    return coldSymptomDetect[100];
  }

  function getColdSymptomAdvice(score: number): string {
    if (score <= 0) return coldSymptomAdvice[0];
    if (score <= 25) return coldSymptomAdvice[25];
    if (score <= 50) return coldSymptomAdvice[50];
    if (score <= 75) return coldSymptomAdvice[75];
    return coldSymptomAdvice[100];
  }

  function getColdSymptomDetail(score: number) : ColdSymptomDetail  {
    if (score <= 0) return coldSymptomLevelsDetail[0];
    if (score <= 25) return coldSymptomLevelsDetail[25];
    if (score <= 50) return coldSymptomLevelsDetail[50];
    if (score <= 75) return coldSymptomLevelsDetail[75];
    return coldSymptomLevelsDetail[100];
  }

  // Handle recording start/stop
  const toggleRecording = async (shouldStop: boolean) => {
    setRecordState(shouldStop)
    if (shouldStop) {
      // Stop recording
      if (startTimeRef.current !== null) {
        accumulatedTimeRef.current += Date.now() - startTimeRef.current;
        startTimeRef.current = null;
      }
      stopRecording()
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      cancelAnimationFrame(rafIdRef.current);
      audioContextRef.current?.close();
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      startRecording()
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
              if (!BlobAudio) return
              const wavBlob = await convertWebMToWavBlob(BlobAudio);
              const res: any = await sendWaveFile(wavBlob, router?.folder as string, localStr)
              if (res) {
                let percentage_value = res?.prediction?.percentage || 0
                setShowDialog(false);          // hide dialog
                setIsAnalyseComplete(true);    // mark analysis complete
                setPercentProgress(percentage_value)
                setSoundDetect(getColdSymptomDetect(percentage_value))
                const symtoms_res = getColdSymptomAdvice(percentage_value)
                setSymtoms(percentage_value)
                setSymptomDetail(getColdSymptomDetail(percentage_value))
                await addSymptomToUser(localStr, symtoms_res, getColdSymptomLevel(percentage_value))
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
        <Progress className="bg-[#caebed] [&>div]:bg-[#58b9bf] [&>div]:rounded-full  w-[40%] h-[2rem] max-xs:w-[65%]" value={percentProgress} />
        <h3 className="text-2xl"> {percentProgress}%</h3>
        <Image src={'/lungs.png'} width={150} height={100} alt="" />

        <div className="flex gap-x-5 pt-4 flex-col py-4 items-center justify-center gap-y-5">
          <h5 className={`font-bold text-xl ${percentProgress == 100 ? "text-green-500" : "text-red-600"} `}> {soundDetect} </h5>
          <h2 className="text-xl font-semibold">{symptomDetail?.title}</h2>
          <p className="text-gray-700 mt-2">{symptomDetail?.description}</p>

          { symptomDetail ? symptomDetail?.possibleDiseases?.length > 0 && (
            <>
              <h3 className="mt-4 font-medium">Possible Diseases:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {symptomDetail.possibleDiseases.map((disease, index) => (
                  <li key={index}>{disease}</li>
                ))}
              </ul>
            </>
          ) : ""}
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


