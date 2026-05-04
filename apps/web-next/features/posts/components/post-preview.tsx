import { I18nText } from "@/components/shared/i18n-text";
import { Button } from "@/components/ui/button";
import { createPrivateChat } from "@/features/chats/actions/create-private-chats";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-provider";
import { PostHeader } from "@packages/ui/features/posts";
import { useTheme } from "next-themes";
import { useRef, useState } from "react";
import { reportPost } from "../actions/report-post";
import PostCommentsSectionProvider from "../providers/post-comment-section-provider";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import PostCommentSection from "./post-comment-section";

export default function PostPreview({
  post,
}: {
  post: PostWithRenderedContent;
}) {
  const { user: me } = useAppContext();
  const { theme } = useTheme();
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
        "relative m-auto my-4 w-[95%] bg-post-light p-4 dark:bg-post-dark lg:w-[60%]",
      )}
    >
      <div className="absolute -top-20" ref={postRef}></div>
      <div className="relative" data-color-mode={theme}>
        <div
          className={cn({
            "sticky top-20 z-30 bg-post-light dark:bg-post-dark": isExpanded,
          })}
        >
          <PostHeader
            post={post}
            createPrivateChatAction={createPrivateChat}
            me={me!}
            reportPost={reportPost}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: post.renderedContent }}
          className={cn(
            "markdown-body bg-post-light! text-post-dark! dark:bg-post-dark! dark:text-post-light! overflow-x-auto overflow-y-hidden",
            { "max-h-72": !isExpanded },
          )}
        ></div>
        <Button
          className={cn({
            "absolute bottom-4 left-1/2 -translate-x-1/2": !isExpanded,
            "sticky bottom-2 left-1/2 mt-4 -translate-x-1/2": isExpanded,
          })}
          onClick={handleToggleExpand}
        >
          {isExpanded ? (
            <I18nText translationKey="posts.preview.show-less" />
          ) : (
            <I18nText translationKey="posts.preview.show-more" />
          )}
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
