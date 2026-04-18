"use client";

import FocusableSpan from "@/components/shared/FocusableSpan";
import { I18nText } from "@/components/shared/I18nText";
import Tooltip from "@/components/shared/Tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Chat } from "@packages/schemas";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { TbLogout2 } from "react-icons/tb";
import { leaveChat } from "../actions/leaveChat";

export default function ChatLeaveDialog() {
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    await leaveChat(id as Chat["id"]);
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={<I18nText translationKey="chats.leave.trigger.tooltip" />}
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
            <I18nText translationKey="chats.leave.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nText translationKey="chats.leave.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <I18nText translationKey="chats.leave.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <I18nText translationKey="chats.leave.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
