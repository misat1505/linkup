import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";
import useChatForm from "../../hooks/chats/useChatForm";
import { useChatContext } from "../../contexts/ChatProvider";

export default function ChatFooter() {
  const { chat } = useChatContext();
  const { register, submitForm } = useChatForm(chat!.id);

  return (
    <form
      onSubmit={submitForm}
      className="flex h-16 items-center gap-x-4 bg-slate-100 px-4"
    >
      <FaFileAlt className="text-blue-500" />
      <Input
        {...register("content")}
        className="z-20 min-h-8"
        placeholder="Type..."
      />
      <button type="submit">
        <IoSend className="text-blue-500 transition-all hover:scale-125" />
      </button>
    </form>
  );
}
