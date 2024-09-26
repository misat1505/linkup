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
import { API_URL } from "../../constants";
import Image from "../common/Image";

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
          <IoPencil className="text-black hover:cursor-pointer dark:text-white" />
        </Link>
      </Tooltip>
      <Tooltip content="Delete">
        <span>
          <FaRegTrashAlt className="text-black hover:cursor-pointer dark:text-white" />
        </span>
      </Tooltip>
    </div>
  );
}
