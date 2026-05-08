"use client";
import { Chat, User, UserInChat } from "@packages/schemas";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../../config";
import { createFullName } from "../../../../utils/create-full-name";
import { FocusableSpan } from "../../../misc/focusable-span";
import { Tooltip } from "../../../misc/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../shadcn/alert-dialog";
import { Input } from "../../../shadcn/input";

type AliasUpdateModalProps = {
  user: UserInChat;
  chatId: Chat["id"];
  updateAliasAction: (
    chatId: Chat["id"],
    userId: User["id"],
    alias: UserInChat["alias"],
  ) => Promise<void>;
  updateAliasCb?: (text: UserInChat["alias"]) => void;
};

export function AliasUpdateModal({
  user,
  chatId,
  updateAliasAction,
  updateAliasCb,
}: AliasUpdateModalProps) {
  const { t } = useUiPackageContext();
  const [text, setText] = useState(user.alias);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputValue = e.target.value;

    setText(inputValue === "" ? null : inputValue);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    try {
      e.preventDefault();

      await updateAliasAction(chatId, user.id, text);
      updateAliasCb?.(text);

      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="chats.settings.users.actions.update-alias.tooltip" />
        }
      >
        <span className="aspect-square rounded-full bg-slate-200 p-1 transition-colors hover:cursor-pointer hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <MdEdit size={20} />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TRANSLATION_COMPONENT
              translationKey="chats.settings.update-alias-dialog.title"
              values={{
                name: createFullName(user),
              }}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TRANSLATION_COMPONENT translationKey="chats.settings.update-alias-dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <Input
            value={text || ""}
            placeholder={t(
              "chats.settings.update-alias-dialog.input.placeholder",
            )}
            onChange={handleChange}
            className="text-sm"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <TRANSLATION_COMPONENT translationKey="chats.settings.update-alias-dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <TRANSLATION_COMPONENT translationKey="chats.settings.update-alias-dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
