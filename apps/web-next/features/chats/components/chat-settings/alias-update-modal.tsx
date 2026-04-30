"use client";
import FocusableSpan from "@/components/shared/focusable-span";
import { I18nText } from "@/components/shared/i18n-text";
import Tooltip from "@/components/shared/tooltip";
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
import { Input } from "@/components/ui/input";
import { useLanguageContext } from "@/providers/language-provider";
import { createFullName } from "@/utils/create-full-name";
import { Chat, UserInChat } from "@packages/schemas";
import { useParams } from "next/navigation";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { updateAlias } from "../../actions/update-alias";

export default function AliasUpdateModal({ user }: { user: UserInChat }) {
  const { t } = useLanguageContext();
  const { id } = useParams();
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

      await updateAlias(id as Chat["id"], user.id, text);

      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={
          <I18nText translationKey="chats.settings.users.actions.update-alias.tooltip" />
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
            <I18nText
              translationKey="chats.settings.update-alias-dialog.title"
              values={{
                name: createFullName(user),
              }}
            />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nText translationKey="chats.settings.update-alias-dialog.description" />
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
            <I18nText translationKey="chats.settings.update-alias-dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <I18nText translationKey="chats.settings.update-alias-dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
