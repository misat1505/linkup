"use client";

import { Post } from "@packages/schemas";
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { TRANSLATION_COMPONENT } from "../../../config";
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

export type DeletePostDialogProps = {
  postId: Post["id"];
  deletePostAction: (id: Post["id"]) => Promise<void>;
  deletePostCb?: (id: Post["id"]) => void;
};

export function DeletePostDialog({
  postId,
  deletePostAction,
  deletePostCb,
}: DeletePostDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    await deletePostAction(postId);
    deletePostCb?.(postId);

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={
          <TRANSLATION_COMPONENT translationKey="posts.delete.button.tooltip" />
        }
      >
        <span className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <FaRegTrashAlt />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <TRANSLATION_COMPONENT translationKey="posts.delete.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <TRANSLATION_COMPONENT translationKey="posts.delete.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <TRANSLATION_COMPONENT translationKey="posts.delete.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <TRANSLATION_COMPONENT translationKey="posts.delete.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
