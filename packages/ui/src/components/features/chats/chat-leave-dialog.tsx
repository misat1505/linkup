"use client";

import { Chat } from "@packages/schemas";
import React, { useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import { navigate, TRANSLATION_COMPONENT } from "../../../config";
import { FocusableSpan } from "../../misc/focusable-span";
import { Tooltip } from "../../misc/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../shadcn/alert-dialog";

type ChatLeaveDialogProps = {
  chatId: Chat["id"];
  leaveChatAction: (id: Chat["id"]) => Promise<void>;
  leaveChatCb?: (id: Chat["id"]) => void;
};

export function ChatLeaveDialog({
  chatId,
  leaveChatAction,
  leaveChatCb,
}: ChatLeaveDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await leaveChatAction(chatId);
    leaveChatCb?.(chatId);
    navigate("/chats");
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="chats.leave.trigger.tooltip" />
        }
      >
        <span className="aspect-square text-red-500 transition-all hover:scale-125 hover:cursor-pointer">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <TbLogout2 size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TRANSLATION_COMPONENT translationKey="chats.leave.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TRANSLATION_COMPONENT translationKey="chats.leave.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <TRANSLATION_COMPONENT translationKey="chats.leave.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <TRANSLATION_COMPONENT translationKey="chats.leave.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
