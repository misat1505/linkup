import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "@/contexts/ChatProvider";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { queryKeys } from "@/lib/queryKeys";
import { ROUTES } from "@/lib/routes";
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
import FocusableSpan from "../common/FocusableSpan";
import { useTranslation } from "react-i18next";

export default function ChatLeaveDialog() {
  const { t } = useTranslation();
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
      <Tooltip content={t("chats.leave.trigger.tooltip")}>
        <span className="aspect-square text-red-500 transition-all hover:scale-125 hover:cursor-pointer">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <TbLogout2 size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("chats.leave.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("chats.leave.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("chats.leave.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t("chats.leave.dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
