import { useChatContext } from "@/contexts/chat-provider";
import { queryKeys } from "@/lib/query-keys";
import { ROUTES } from "@/lib/routes";
import { ChatService } from "@/services/chat.service";
import { Chat } from "@packages/schemas";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { TbLogout2 } from "react-icons/tb";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import FocusableSpan from "../common/focusable-span";
import Tooltip from "../common/tooltip";
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

export default function ChatLeaveDialog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { chatId } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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
