import { getPost } from "@/features/posts/actions/get-post";
import Editor from "@/features/editor/components/editor";
import EditorProvider from "@/features/editor/providers/editor-provider";
import { notFound } from "next/navigation";
import AuthGuard from "@/components/auth-guard";

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
        <Editor />
      </EditorProvider>
    </AuthGuard>
  );
}
