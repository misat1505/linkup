"use client";

import { useState } from "react";
import { Post } from "../schemas/post";
import { deletePost } from "../actions/deletePost";
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
import { I18nText } from "@/components/shared/I18nText";
import FocusableSpan from "@/components/shared/FocusableSpan";
import { FaRegTrashAlt } from "react-icons/fa";
import Tooltip from "@/components/shared/Tooltip";

export default function DeletePostDialog({ postId }: { postId: Post["id"] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = async () => {
    await deletePost(postId);

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip
        content={<I18nText translationKey="posts.delete.button.tooltip" />}
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
            <I18nText translationKey="posts.delete.dialog.title" />
          </AlertDialogTitle>
          <AlertDialogDescription>
            <I18nText translationKey="posts.delete.dialog.description" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            <I18nText translationKey="posts.delete.dialog.cancel" />
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            <I18nText translationKey="posts.delete.dialog.confirm" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
