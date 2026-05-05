import { useAppContext } from "@/contexts/app-provider";
import PostCommentsSectionProvider from "@/contexts/post-comment-section-provider";
import { useThemeContext } from "@/contexts/theme-provider";
import { queryKeys } from "@/lib/query-keys";
import { cn } from "@/lib/utils";
import { ChatService } from "@/services/chat.service";
import { PostService } from "@/services/post.service";
import { markdownPreviewOptions } from "@/utils/markdown-preview-options";
import { Chat, Post } from "@packages/schemas";
import { PostHeader } from "@packages/ui/components/features/posts/post-header";
import MDEditor from "@uiw/react-md-editor";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "react-query";
import { Button } from "../ui/button";
import PostCommentSection from "./post-comment-section";

export default function PostPreview({ post }: { post: Post }) {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const { user: me } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const postRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const handleToggleExpand = () => {
    setIsExpanded((prev) => {
      if (prev) {
        postRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      return !prev;
    });
  };

  function createPrivateChatCb(chat: Chat) {
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
      return oldChats ? [...oldChats, chat] : [chat];
    });
  }

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
            reportPost={PostService.reportPost}
            createPrivateChatAction={ChatService.createPrivateChat}
            me={me!}
            createPrivateChatCb={createPrivateChatCb}
          />
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
          {isExpanded
            ? t("posts.preview.show-less")
            : t("posts.preview.show-more")}
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
