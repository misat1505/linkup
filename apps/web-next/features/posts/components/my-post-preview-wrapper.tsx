import { MyPostPreview } from "@packages/ui/components/features/posts/my-post-preview";
import { useTheme } from "next-themes";
import { deletePost } from "../actions/delete-post";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";

export default function MyPostPreviewWrapper({
  post,
}: {
  post: PostWithRenderedContent;
}) {
  return (
    <MyPostPreview
      renderedContent={post.renderedContent}
      // @ts-expect-error it will work
      useTheme={useTheme}
      post={post}
      isPrerendered
      deletePostAction={deletePost}
    />
  );
}
