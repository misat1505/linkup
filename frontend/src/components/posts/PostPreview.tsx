import MDEditor from "@uiw/react-md-editor";
import { useThemeContext } from "../../contexts/ThemeProvider";
import { Post } from "../../types/Post";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import PostHeader from "./PostHeader";
import { markdownPreviewOptions } from "../../utils/markdownPreviewOptions";

export default function PostPreview({ post }: { post: Post }) {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);

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
      <MDEditor.Markdown
        source={post.content}
        components={markdownPreviewOptions}
      />
      {!isExpanded && (
        <Button
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </Button>
      )}
    </div>
  );
}
