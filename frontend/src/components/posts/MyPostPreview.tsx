import { useThemeContext } from "../../contexts/ThemeProvider";
import { cn } from "../../lib/utils";
import { Post } from "../../types/Post";
import MDEditor from "@uiw/react-md-editor";
import React, { useState } from "react";
import { Button } from "../ui/button";
import PostHeader from "./PostHeader";
import { IoPencil } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

export default function MyPostPreview({ post }: { post: Post }) {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      data-color-mode={theme}
      className={cn(
        "m-auto my-4 w-[95%] overflow-hidden rounded-md p-4 lg:w-[60%]",
        {
          "relative max-h-72": !isExpanded
        }
      )}
      style={{ backgroundColor: theme === "light" ? "white" : "#0c1117" }}
    >
      <PostHeader post={post} />
      <MDEditor.Markdown source={post.content} />
      <Button
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        Show {isExpanded ? "less" : "more"}
      </Button>
      <div className="absolute right-4 top-4 flex items-center gap-x-4">
        <IoPencil
          className="text-white"
          onClick={() =>
            navigate(ROUTES.POST_EDITOR.buildPath({ postId: post.id }))
          }
        />
        <FaRegTrashAlt className="text-white" />
      </div>
    </div>
  );
}
