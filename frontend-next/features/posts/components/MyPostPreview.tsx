import { IoPencil } from "react-icons/io5";
import { MyPostPreviewCollapse } from "./MyPostPreviewCollapse";
import { I18nText } from "@/components/shared/I18nText";
import Link from "next/link";
import { Post, PostWithRenderedContent } from "../schemas/post";
import Tooltip from "@/components/shared/Tooltip";
import MyPostHeader from "./MyPostHeader";
import DeletePostDialog from "./DeetePostDialog";

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
        className="markdown-body"
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
