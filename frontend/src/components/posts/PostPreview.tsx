import { useThemeContext } from "@/contexts/ThemeProvider";
import { cn } from "@/lib/utils";
import { Post } from "@/types/Post";
import MDEditor from "@uiw/react-md-editor";
import { useRef, useState } from "react";
import PostHeader from "./PostHeader";
import { markdownPreviewOptions } from "@/utils/markdownPreviewOptions";
import { Button } from "../ui/button";
import PostCommentsSectionProvider from "@/contexts/PostCommentSectionProvider";
import PostCommentSection from "./PostCommentSection";

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
        "relative m-auto my-4 w-[95%] bg-post-light p-4 dark:bg-post-dark lg:w-[60%]"
      )}
    >
      <div className="absolute -top-20" ref={postRef}></div>
      <div className="relative" data-color-mode={theme}>
        <div
          className={cn({
            "sticky top-20 z-30 bg-post-light dark:bg-post-dark": isExpanded,
          })}
        >
          <PostHeader post={post} />
        </div>
        <MDEditor.Markdown
          className={cn("overflow-x-auto overflow-y-hidden", {
            "max-h-72": !isExpanded,
          })}
          source={post.content}
          components={markdownPreviewOptions}
        />
        <Button
          className={cn({
            "absolute bottom-4 left-1/2 -translate-x-1/2": !isExpanded,
            "sticky bottom-2 left-1/2 mt-4 -translate-x-1/2": isExpanded,
          })}
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
