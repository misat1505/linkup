import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import EditorProvider from "@/contexts/EditorProvider";
import Editor from "@/components/posts/Editor";
import { useAppContext } from "@/contexts/AppProvider";
import { queryKeys } from "@/lib/queryKeys";
import { PostService } from "@/services/Post.service";
import Loading from "@/components/common/Loading";

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
    queryFn: () => PostService.getPost(postId!),
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
