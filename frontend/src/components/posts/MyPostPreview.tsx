import MDEditor from "@uiw/react-md-editor";
import { useState } from "react";
import { IoPencil } from "react-icons/io5";
import { FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useQueryClient } from "react-query";
import PostHeader from "./PostHeader";
import { markdownPreviewOptions } from "@/utils/markdownPreviewOptions";
import { Button } from "../ui/button";
import Tooltip from "../common/Tooltip";
import { ROUTES } from "@/lib/routes";
import { Post } from "@/types/Post";
import { PostService } from "@/services/Post.service";
import { queryKeys } from "@/lib/queryKeys";
import FocusableSpan from "../common/FocusableSpan";
import { useThemeContext } from "@/contexts/ThemeProvider";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function MyPostPreview({ post }: { post: Post }) {
  const { t } = useTranslation();
  const { theme } = useThemeContext();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      data-color-mode={theme}
      className={cn(
        "relative m-auto my-4 w-[95%] overflow-hidden p-4 lg:w-[60%]",
        {
          "max-h-72": !isExpanded,
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
        {isExpanded
          ? t("posts.preview.show-less")
          : t("posts.preview.show-more")}
      </Button>
      <PostActions postId={post.id} />
    </div>
  );
}

function PostActions({ postId }: { postId: Post["id"] }) {
  const { t } = useTranslation();

  return (
    <div className="absolute right-4 top-4 flex items-center gap-x-4">
      <Tooltip content={t("posts.edit.button.tooltip")}>
        <Link to={ROUTES.POST_EDITOR.$buildPath({ params: { postId } })}>
          <IoPencil className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white" />
        </Link>
      </Tooltip>
      <DeletePostDialog postId={postId} />
    </div>
  );
}

function DeletePostDialog({ postId }: { postId: Post["id"] }) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleClick = async () => {
    await PostService.deletePost(postId);

    const updaterFn = (oldPosts: Post[] | undefined) => {
      if (!oldPosts) return [];
      return oldPosts.filter((post) => post.id !== postId);
    };

    queryClient.setQueryData<Post[]>(queryKeys.myPosts(), (oldPosts) =>
      updaterFn(oldPosts)
    );
    queryClient.setQueryData<Post[]>(queryKeys.posts(), (oldPosts) =>
      updaterFn(oldPosts)
    );

    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen}>
      <Tooltip content={t("posts.delete.button.tooltip")}>
        <span className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white">
          <FocusableSpan fn={() => setIsOpen(true)}>
            <FaRegTrashAlt />
          </FocusableSpan>
        </span>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("posts.delete.dialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("posts.delete.dialog.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("posts.delete.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>
            {t("posts.delete.dialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
