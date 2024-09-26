import MDEditor from "@uiw/react-md-editor";
import { useThemeContext } from "../../contexts/ThemeProvider";
import { Post } from "../../types/Post";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import PostHeader from "./PostHeader";
import { API_URL } from "../../constants";
import Image from "../common/Image";

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
        components={{
          video({ node, ...props }) {
            return (
              <video {...props} key={props.src} controls>
                {(props?.children as any)?.map((child: any, index: number) => {
                  if (child.type !== "source") return null;
                  if (!child.props.src.startsWith(API_URL))
                    return <div key={index}>Given source is unavailable</div>;

                  return <source key={index} {...child.props} />;
                })}
                Your browser does not support the video tag.
              </video>
            );
          },
          img({ node, ...props }) {
            if (!props.src!.startsWith(API_URL)) {
              return <div>{props.alt || "Image not available"}</div>;
            }
            return (
              <Image
                src={props.src!}
                alt={props.alt || "image"}
                unloader={<div>{props.alt}</div>}
              />
            );
          },
          ul(props) {
            return <ul {...props} style={{ listStyle: "disc" }}></ul>;
          },
          ol(props) {
            return <ol {...props} style={{ listStyle: "decimal" }}></ol>;
          }
        }}
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
