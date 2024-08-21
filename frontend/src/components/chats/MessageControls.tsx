import React from "react";
import { RiReplyFill } from "react-icons/ri";

export default function MessageControls() {
  return (
    <div className="hidden group-hover:block">
      <div className="flex items-center gap-x-4">
        <RiReplyFill
          size={20}
          className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
        />
      </div>
    </div>
  );
}
