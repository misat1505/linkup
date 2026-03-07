"use client";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import { FaSave } from "react-icons/fa";

import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { useTheme } from "next-themes";
import { useEditorContext } from "../providers/EditorProvider";
import { markdownPreviewOptions } from "../utils/markdownPreviewOptions";
// import FileDialog from "./FileDialog";

export default function Editor() {
  const router = useRouter();
  const { t } = useLanguageContext();
  const { markdown, handleSafeChange, handleSave, variant } =
    useEditorContext();
  const { toast } = useToast();
  const { theme } = useTheme();

  const buttonText = variant === "new" ? "Save" : "Update";

  const successText =
    variant === "new"
      ? t("editor.toasts.created-successfully.title")
      : t("editor.toasts.updated-successfully.title");

  const failureText =
    variant === "new"
      ? t("editor.toasts.create-error.title")
      : t("editor.toasts.update-error.title");

  const customExtraCommands: ICommand[] = [
    {
      name: buttonText,
      keyCommand: buttonText,
      buttonProps: { "aria-label": buttonText, title: buttonText },
      icon: <FaSave />,
      execute: async (_, __) => {
        try {
          const post = await handleSave();
          handleSafeChange(post.content);
          router.push(`/posts/editor/${post.id}`);
          toast({
            title: successText,
          });
        } catch {
          toast({
            variant: "destructive",
            title: failureText,
          });
        }
      },
    },
  ];

  // const customCommands: ICommand[] = [
  //   {
  //     name: "files",
  //     keyCommand: "files",
  //     buttonProps: { "aria-label": buttonText, title: "show files" },
  //     icon: <FileDialog content={markdown} />,
  //   },
  // ];

  return (
    <div data-color-mode={theme} className="w-full">
      <MDEditor
        data-testid="cy-post-editor"
        value={markdown}
        onChange={(text) => handleSafeChange(text || "")}
        commands={[...commands.getCommands()]}
        extraCommands={[...commands.getExtraCommands(), ...customExtraCommands]}
        className="h-[calc(100vh-5rem)]! grow overflow-auto!"
        highlightEnable={true}
        previewOptions={{
          components: markdownPreviewOptions,
        }}
      />
    </div>
  );
}
