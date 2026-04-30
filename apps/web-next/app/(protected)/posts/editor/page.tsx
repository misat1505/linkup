import AuthGuard from "@/components/auth-guard";
import Editor from "@/features/editor/components/editor";
import EditorProvider from "@/features/editor/providers/editor-provider";

export default function PostEditorPage() {
  return (
    <AuthGuard>
      <EditorProvider variant="new">
        <Editor />
      </EditorProvider>
    </AuthGuard>
  );
}
