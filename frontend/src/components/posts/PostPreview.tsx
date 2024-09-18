import MDEditor from "@uiw/react-md-editor";
import { useThemeContext } from "../../contexts/ThemeProvider";
import { Post } from "../../types/Post";
import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { buildFileURL } from "../../utils/buildFileURL";
import { getInitials } from "../../utils/getInitials";
import { timeDifference } from "../../utils/timeDifference";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

export default function PostPreview({ post }: { post: Post }) {
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-color-mode={theme}
      className={cn("m-auto my-4 max-w-[60%] overflow-hidden rounded-md p-4", {
        "relative max-h-72": !isExpanded
      })}
      style={{ backgroundColor: theme === "light" ? "white" : "#0c1117" }}
    >
      <PostHeader post={post} />
      <MDEditor.Markdown source={post.content} />
      {!isExpanded && (
        <Button
          variant="blueish"
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          onClick={() => setIsExpanded(true)}
        >
          Show more
        </Button>
      )}
    </div>
  );
}

function PostHeader({ post }: { post: Post }) {
  const getTimeText = (): string => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) return `${timeDiff.days} days ago`;
    else if (timeDiff.hours) return `${timeDiff.hours} hours ago`;
    else if (timeDiff.minutes > 5) return `${timeDiff.minutes} minutes ago`;
    else return "Just now";
  };

  const { author } = post;

  return (
    <div className="flex items-center gap-x-4 py-4">
      <Avatar
        className="border"
        src={buildFileURL(author.photoURL, { type: "avatar" })}
        alt={getInitials(author)}
      />
      <div>
        <h2 className="text-lg font-semibold">
          {author.firstName} {author.lastName}
        </h2>
        <p className="text-md">{getTimeText()}</p>
      </div>
    </div>
  );
}
