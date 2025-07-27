"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Navbar() {
  const pathName = usePathname();
  const { str_path, main_or_sub } = path_name_function(pathName);

  return (
    <header
      className={`w-full flex ${
        main_or_sub ? "justify-start" : "justify-center"
      } bg-[#58b9bf] items-center grow px-4  text-white font-semibold text-xl`}
    >
      {pathName !== "/" && (
        <div className="mr-4 ">
         <Link href={"/"}>← Back </Link> 
        </div>
      )}
      <h1 className="mx-10"> {str_path} </h1>
    </header>
  );
}

function path_name_function(pathName: string): {
  str_path: string;
  main_or_sub: number;
} {
  let str_path = "";
  let main_or_sub = 0;

  switch (pathName) {
    case "/":
      str_path = "Welcome";
      main_or_sub = 0;
      break;
    case "/survey":
      str_path = "Symptom";
      main_or_sub = 1;
      break;
    case "/history":
      str_path = "History";
      main_or_sub = 1;
      break;
    default:
      str_path = "Sound analyze";
      main_or_sub = 1;
      break;
  }

  return { str_path, main_or_sub };
}
