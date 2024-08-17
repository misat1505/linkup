import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { Textarea } from "../ui/textarea";
import { IoSend } from "react-icons/io5";
import { Input } from "../ui/input";
import useChatForm from "../../hooks/chats/useChatForm";
import { Chat } from "../../models/Chat";
import { useChatContext } from "../../contexts/ChatProvider";
import { cn } from "../../lib/utils";
import { ClipLoader } from "react-spinners";

export default function ChatFooter({ chatId }: { chatId: Chat["id"] }) {
  const { isLoading } = useChatContext();
  const { register, submitForm, isSubmitting } = useChatForm(chatId);

  const isDisabled = isLoading || isSubmitting;

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
      <button type="submit" disabled={isDisabled}>
        {isSubmitting ? (
          <ClipLoader size={20} color="grey" />
        ) : (
          <IoSend
            className={cn("text-blue-500 transition-all", {
              "opacity-40": isLoading,
              "hover:scale-125": !isLoading
            })}
          />
        )}
      </button>
    </form>
  );
}
