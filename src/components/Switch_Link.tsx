import React from "react";

export default function Switch_Link({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-[65vh] flex items-center justify-center bg-amber-100">
      {children}
    </main>
  );
}
