import { I18nText } from "@/components/shared/i18n-text";
import Tooltip from "@/components/shared/tooltip";
import { Post } from "@packages/schemas";
import Link from "next/link";
import { IoPencil } from "react-icons/io5";
import {
  PostWithRenderedContent,
} from "../schemas/post-with-rendered-content";
import DeletePostDialog from "./delete-post-dialog";
import MyPostHeader from "./my-post-header";
import { MyPostPreviewCollapse } from "./my-post-preview-collapse";

export default function MyPostPreview({
  post,
}: {
  post: PostWithRenderedContent;
}) {
  return (
    <MyPostPreviewCollapse>
      <MyPostHeader post={post} />
      <div
        dangerouslySetInnerHTML={{ __html: post.renderedContent }}
        className="markdown-body bg-post-light! text-post-dark! dark:bg-post-dark! dark:text-post-light!"
      ></div>
      <PostActions postId={post.id} />
    </MyPostPreviewCollapse>
  );
}

function PostActions({ postId }: { postId: Post["id"] }) {
  return (
    <div className="absolute right-4 top-4 flex items-center gap-x-4">
      <Tooltip
        content={<I18nText translationKey="posts.edit.button.tooltip" />}
      >
        <Link href={`/posts/editor/${postId}`}>
          <IoPencil className="text-black transition-all hover:scale-110 hover:cursor-pointer dark:text-white" />
        </Link>
      </Tooltip>
      <DeletePostDialog postId={postId} />
    </div>
  );
}
