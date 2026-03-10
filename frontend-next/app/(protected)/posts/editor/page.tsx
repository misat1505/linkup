import Editor from "@/features/editor/components/Editor";
import EditorProvider from "@/features/editor/providers/EditorProvider";

export default function PostEditorPage() {
  return (
    <EditorProvider variant="new">
      <Editor />
    </EditorProvider>
  );
}
