import React, { PropsWithChildren } from "react";

export default function BgGradient({ children }: PropsWithChildren) {
  return (
    <div className="absolute inset-0 w-screen overflow-auto bg-gradient-to-r from-blue-500 to-white">
      {children}
    </div>
  );
}
