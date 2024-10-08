import { useThemeContext } from "../../contexts/ThemeProvider";
import { cn } from "../../lib/utils";
import { Post } from "../../types/Post";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { Button } from "../ui/button";
import PostHeader from "./PostHeader";
import { IoPencil } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import Tooltip from "../common/Tooltip";
import { markdownPreviewOptions } from "../../utils/markdownPreviewOptions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "../ui/alert-dialog";
import { PostService } from "../../services/Post.service";

export default function MyPostPreview({ post }: { post: Post }) {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-color-mode={theme}
      className={cn(
        "relative m-auto my-4 w-[95%] overflow-hidden rounded-md p-4 lg:w-[60%]",
        {
          "max-h-72": !isExpanded
        }
      )}
      style={{ backgroundColor: theme === "light" ? "white" : "#0c1117" }}
    >
      <PostHeader post={post} />
      <MDEditor.Markdown
        source={post.content}
        components={markdownPreviewOptions}
      />
      <Button
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        Show {isExpanded ? "less" : "more"}
      </Button>
      <PostActions postId={post.id} />
    </div>
  );
}

function PostActions({ postId }: { postId: Post["id"] }) {
  return (
    <div className="absolute right-4 top-4 flex items-center gap-x-4">
      <Tooltip content="Edit">
        <Link to={ROUTES.POST_EDITOR.buildPath({ postId })}>
          <IoPencil className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white" />
        </Link>
      </Tooltip>
      <DeletePostDialog postId={postId} />
    </div>
  );
}

function DeletePostDialog({ postId }: { postId: Post["id"] }) {
  const handleClick = async () => {
    await PostService.deletePost(postId);
    console.log(`Deleting post: ${postId}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span>
          <Tooltip content="Delete">
            <span>
              <FaRegTrashAlt className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white" />
            </span>
          </Tooltip>
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post? This will delete your
            post, it&apos;s comments, and all files related with this post.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            Yes, delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
