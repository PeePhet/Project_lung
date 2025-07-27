import { NotoSansThin } from "@/fonts/font";
import React from "react";

export default function Main_box({ children }: { children: React.ReactNode }) {
  return (
    <div className={`w-auto h-screen bg-white text-black flex flex-col ${NotoSansThin.className}`}>
      {children}
    </div>
  );
}
