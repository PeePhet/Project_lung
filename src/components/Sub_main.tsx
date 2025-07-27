import React from "react";

export default function Sub_main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full flex items-center justify-center grow-4 flex-col ">
      {children}
    </main>
  );
}
