import { getPost } from "@/features/posts/actions/getPost";
import Editor from "@/features/editor/components/Editor";
import EditorProvider from "@/features/editor/providers/EditorProvider";
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
    <EditorProvider variant="update" post={post}>
      <Editor />
    </EditorProvider>
  );
}
