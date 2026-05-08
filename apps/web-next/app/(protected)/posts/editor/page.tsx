import AuthGuard from "@/components/auth-guard";
import EditorWrapper from "@/features/editor/components/editor-wrapper";
import EditorProvider from "@/features/editor/providers/editor-provider";

export default function PostEditorPage() {
  return (
    <AuthGuard>
      <EditorProvider variant="new">
        <EditorWrapper />
      </EditorProvider>
    </AuthGuard>
  );
}
