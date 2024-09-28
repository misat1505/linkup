import { useParams } from "react-router-dom";
import Editor from "../components/posts/Editor";
import React from "react";
import { useQuery } from "react-query";
import Loading from "../components/common/Loading";
import { PostService } from "../services/Post.service";
import { useAppContext } from "../contexts/AppProvider";
import EditorProvider from "../contexts/EditorProvider";
import { queryKeys } from "../lib/queryKeys";

export default function PostEditor() {
  const { postId } = useParams();

  if (!postId)
    return (
      <EditorProvider variant="new">
        <Editor />
      </EditorProvider>
    );

  return <PostEditorExistent />;
}

function PostEditorExistent() {
  const { user: me } = useAppContext();
  const { postId } = useParams();
  const { isLoading, data: post } = useQuery({
    queryKey: queryKeys.post(postId!),
    queryFn: () => PostService.getPost(postId!)
  });

  if (isLoading) return <Loading />;

  if (!post) return <div>Post not found.</div>;

  if (post.author.id !== me!.id) return <div>You cannot modify this post.</div>;

  return (
    <EditorProvider variant="update" post={post}>
      <Editor />
    </EditorProvider>
  );
}
