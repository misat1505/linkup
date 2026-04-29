import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import EditorProvider from "@/contexts/editor-provider";
import Editor from "@/components/posts/editor";
import { useAppContext } from "@/contexts/app-provider";
import { queryKeys } from "@/lib/query-keys";
import { PostService } from "@/services/post.service";
import Loading from "@/components/common/loading";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { useTranslation } from "react-i18next";

export default function PostEditor() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.editor"));
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
