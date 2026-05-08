import EditorWrapper from "@/components/posts/editor-wrapper";
import { useAppContext } from "@/contexts/app-provider";
import EditorProvider from "@/contexts/editor-provider";
import useChangeTabTitle from "@/hooks/use-change-tab-title";
import { queryKeys } from "@/lib/query-keys";
import { PostService } from "@/services/post.service";
import { Loading } from "@packages/ui/components/misc/loading";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function PostEditor() {
  const { t } = useTranslation();
  useChangeTabTitle(t("tabs.editor"));
  const { postId } = useParams();

  if (!postId)
    return (
      <EditorProvider variant="new">
        <EditorWrapper />
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
      <EditorWrapper />
    </EditorProvider>
  );
}
