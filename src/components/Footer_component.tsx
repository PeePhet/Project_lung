import React from "react";

export default function Footer_component({ children }: { children: React.ReactNode }) {
  return (
    <footer className=" w-full  flex flex-col justify-center gap-y-5 items-center text-2xl grow-6">
      {children}
    </footer>
  );
}
