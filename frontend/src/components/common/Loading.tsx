import React from "react";
import { SyncLoader } from "react-spinners";

type LoadingProps = {
  text?: string;
};

export default function Loading({ text }: LoadingProps) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
      <SyncLoader color="#3a82f6" />
      {text ? <p className="mt-2 text-sm">{text}</p> : null}
    </div>
  );
}
