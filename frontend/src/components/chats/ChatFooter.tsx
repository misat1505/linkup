import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";

export default function ChatFooter() {
  return (
    <form className="flex h-16 items-center gap-x-4 bg-slate-100 px-4">
      <FaFileAlt className="text-blue-500" />
      <Input className="z-20 min-h-8" placeholder="Type..." />
      <IoSend className="text-blue-500" />
    </form>
  );
}
