import { useChatContext } from "../../contexts/ChatProvider";
import { queryKeys } from "../../lib/queryKeys";
import { ChatService } from "../../services/Chat.service";
import { Chat } from "../../types/Chat";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Tooltip from "../common/Tooltip";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import FocusableSpan from "../common/FocusableSpan";

export default function ChatLeaveDialog() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await ChatService.leaveChat(chatId);

    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (!oldChats) return [];

      const newChats = oldChats.filter((c) => c.id !== chatId);
      return newChats;
    });

    setIsOpen(false);
    navigate(ROUTES.CHATS.$path());
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip content="Leave chat">
        <span className="aspect-square text-red-500 transition-all hover:scale-125 hover:cursor-pointer">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <TbLogout2 size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave chat</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this chat? By leaving, you will no
            longer have access to the ongoing conversation. If you’re sure about
            your decision, please confirm below.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
