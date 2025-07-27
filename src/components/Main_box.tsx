import { NotoSansThin } from "@/fonts/font";
import React from "react";

export default function Main_box({ children }: { children: React.ReactNode }) {
  return (
    <div className={`w-screen h-screen bg-white text-black flex flex-col ${NotoSansThin.className}`}>
      {children}
    </div>
  );
}
