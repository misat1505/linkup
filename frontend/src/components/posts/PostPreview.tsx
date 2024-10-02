import MDEditor from "@uiw/react-md-editor";
import { useThemeContext } from "../../contexts/ThemeProvider";
import { Post } from "../../types/Post";
import React, { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import PostHeader from "./PostHeader";
import { markdownPreviewOptions } from "../../utils/markdownPreviewOptions";
import PostCommentSection from "./PostCommentSection";
import PostCommentsSectionProvider from "../../contexts/PostCommentSectionProvider";

export default function PostPreview({ post }: { post: Post }) {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);

  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      if (prev) {
        postRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return !prev;
    });
  };

  return (
    <div
      className={cn(
        "relative m-auto my-4 w-[95%] rounded-md bg-post-light p-4 dark:bg-post-dark lg:w-[60%]"
      )}
    >
      <div className="absolute -top-20" ref={postRef}></div>
      <div
        className={cn("relative overflow-hidden", {
          "max-h-72": !isExpanded
        })}
        data-color-mode={theme}
      >
        <PostHeader post={post} />
        <MDEditor.Markdown
          source={post.content}
          components={markdownPreviewOptions}
        />
        <Button
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={handleToggleExpand}
        >
          Show {isExpanded ? "less" : "more"}
        </Button>
      </div>
      {isExpanded && (
        <PostCommentsSectionProvider chat={post.chat}>
          <PostCommentSection />
        </PostCommentsSectionProvider>
      )}
    </div>
  );
}
