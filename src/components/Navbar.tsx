"use client";

import Link from "next/link";
import { usePathname, useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [local_id, setLocal_id] = useState<string>("")
  const [isComplete, setIsComplete] = useState<boolean>(true)
  const [gotoPath, setGotoPath] = useState<string>("")
  const pathName = usePathname();
  const paramValue = useParams()
  const router = useRouter()
  const topLevelRoute = "/" + pathName.split("/")[1]; // "/survey"
  const params = paramValue?.folder as string
  const { str_path, main_or_sub, GotoPath } = path_name_function(topLevelRoute, params);

  useEffect(() => {
    if (isComplete) {
      setGotoPath(GotoPath)
    } else {
      setGotoPath("/survey/" + params)
    }

  }, [isComplete, gotoPath])

  useEffect(()=>{
    const user_id : string | null = localStorage.getItem("_id")
    setLocal_id(user_id || "")
  },[])

  return (
    <header
      className={`w-full flex ${main_or_sub ? "justify-start" : "justify-center"
        } bg-[#58b9bf] items-center grow-1 px-4  text-white font-semibold text-[18px] max-xs:h-[5%] `}
    >
      {pathName !== "/" && (
        <div className="mr-4 cursor-pointer ">
          <button className="cursor-pointer " type="button" onClick={() => {
            setIsComplete(!isComplete)
            router.push(gotoPath)
          }}>← Back </button>
        </div>
      )}
      <Link href={"/history?u="+ local_id} className={`${!main_or_sub ?  "hidden" :  ""}`}>
        History
      </Link>
      <h1 className="mx-10"> {str_path} </h1>

    </header>
  );
}

function path_name_function(pathName: string, params: string): {
  str_path: string;
  main_or_sub: number;
  GotoPath: string
} {
  let str_path = "";
  let main_or_sub = 0;
  let GotoPath = "/"


  switch (pathName) {
    case "/":
      str_path = "Home";
      main_or_sub = 0;
      break;
    case "/survey":
      if (params != undefined) {
        str_path = "Sound analyze";
        GotoPath = pathName
      } else {
        str_path = "Symptom";
      }
      main_or_sub = 1;
      break;
    case "/history":
      str_path = "History";
      main_or_sub = 1;
      break;
    default:
      break;
  }

  return { str_path, main_or_sub, GotoPath };
}
