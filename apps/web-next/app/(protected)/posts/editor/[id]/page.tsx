import AuthGuard from "@/components/auth-guard";
import EditorWrapper from "@/features/editor/components/editor-wrapper";
import EditorProvider from "@/features/editor/providers/editor-provider";
import { getPost } from "@/features/posts/actions/get-post";
import { notFound } from "next/navigation";

export default async function PostEditorUpdatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const postId = (await params).id;

  const post = await getPost(postId!);

  if (!post) return notFound();

  return (
    <AuthGuard>
      <EditorProvider variant="update" post={post}>
        <EditorWrapper />
      </EditorProvider>
    </AuthGuard>
  );
}
