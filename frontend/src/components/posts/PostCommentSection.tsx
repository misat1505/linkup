import { FaArrowDown } from "react-icons/fa";
import { Chat } from "../../types/Chat";
import React from "react";
import { cn } from "../../lib/utils";
import { usePostCommentsSectionContext } from "../../contexts/PostCommentSectionProvider";
import Tooltip from "../common/Tooltip";

export default function PostCommentSection() {
  return (
    <div>
      <CommentSectionOpenButton />
    </div>
  );
}

function CommentSectionOpenButton() {
  const { isCommentSectionOpen, toggleIsCommentSectionOpen } =
    usePostCommentsSectionContext();

  const tooltipText = isCommentSectionOpen ? "Close comments" : "Open comments";

  return (
    <Tooltip content={tooltipText}>
      <button
        className="hover:bg-post-dark/20 dark:hover:bg-post-light/20 mt-4 flex w-full justify-center rounded-md p-4 transition-all hover:opacity-50"
        onClick={toggleIsCommentSectionOpen}
      >
        <FaArrowDown className={cn({ "rotate-180": isCommentSectionOpen })} />
      </button>
    </Tooltip>
  );
}
