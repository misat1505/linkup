"use client";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import { FaSave } from "react-icons/fa";

import { Post } from "@packages/schemas";
import { navigate, useUiPackageContext } from "../../../config";
import { markdownPreviewOptions } from "../../../utils/markdown-preview-options";
import { toast } from "../../shadcn";
import { FileDialog, FileDialogProps } from "./file-dialog";

type EditorProps = Omit<FileDialogProps, "content"> & {
  markdown: Post["content"];
  handleSafeChange: (text: Post["content"]) => void;
  variant: "new" | "update";
  handleSave: () => Promise<Post>;
  theme: "light" | "dark";
};

export function Editor({
  handleSafeChange,
  handleSave,
  markdown,
  theme,
  variant,
  ...fileDialogProps
}: EditorProps) {
  const { t } = useUiPackageContext();

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      execute: async (_, __) => {
        try {
          const post = await handleSave();
          handleSafeChange(post.content);
          navigate(`/posts/editor/${post.id}`);
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

  const customCommands: ICommand[] = [
    {
      name: "files",
      keyCommand: "files",
      buttonProps: { "aria-label": buttonText, title: "show files" },
      icon: <FileDialog content={markdown} {...fileDialogProps} />,
    },
  ];

  return (
    <div data-color-mode={theme} className="w-full h-[calc(100vh-5rem)]">
      <MDEditor
        data-testid="cy-post-editor"
        value={markdown}
        onChange={(text) => handleSafeChange(text || "")}
        commands={[...commands.getCommands(), ...customCommands]}
        extraCommands={[...commands.getExtraCommands(), ...customExtraCommands]}
        className="!h-full grow overflow-auto!"
        highlightEnable={true}
        previewOptions={{
          components: markdownPreviewOptions,
        }}
      />
    </div>
  );
}
