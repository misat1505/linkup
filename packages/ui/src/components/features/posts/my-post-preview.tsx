import { Post } from "@packages/schemas";
import { DeletePostDialog, DeletePostDialogProps } from "./delete-post-dialog";
import { EditChatLink } from "./edit-chat-link";
import MyPostHeader from "./my-post-header";
import {
  MyPostPreviewCollapse,
  MyPostPreviewCollapseProps,
} from "./my-post-preview-collapse";
import MyPostPreviewNotPrerenderedContentWrapper from "./my-post-preview-not-prerendered-content-wrapper";

type IsPrerendered =
  | { isPrerendered: true; renderedContent: string }
  | { isPrerendered: false };

type MyPostPreviewProps = IsPrerendered &
  MyPostPreviewCollapseProps &
  Omit<DeletePostDialogProps, "postId"> & {
    post: Post;
  };

export function MyPostPreview({ post, useTheme, ...rest }: MyPostPreviewProps) {
  return (
    <MyPostPreviewCollapse useTheme={useTheme}>
      <MyPostHeader post={post} />
      {rest.isPrerendered ? (
        <div
          dangerouslySetInnerHTML={{ __html: rest.renderedContent }}
          className="markdown-body bg-post-light! text-post-dark! dark:bg-post-dark! dark:text-post-light!"
        ></div>
      ) : (
        <MyPostPreviewNotPrerenderedContentWrapper
          content={post.content}
          useTheme={useTheme}
        />
      )}
      <PostActions
        postId={post.id}
        deletePostAction={rest.deletePostAction}
        deletePostCb={rest.deletePostCb}
      />
    </MyPostPreviewCollapse>
  );
}

function PostActions(props: DeletePostDialogProps & { postId: Post["id"] }) {
  return (
    <div className="absolute right-4 top-4 flex items-center gap-x-4">
      <EditChatLink id={props.postId} />
      <DeletePostDialog {...props} />
    </div>
  );
}
