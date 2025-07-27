import React from "react";
import clsx from "clsx";
export default function Sub_main({ children, className_custom }: { children: React.ReactNode, className_custom?: string | null; }) {
  return (
    <main className={clsx("w-full grow-4 overflow-hidden", className_custom)}>
      {children}
    </main>
  );
}
