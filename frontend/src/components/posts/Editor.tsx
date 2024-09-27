import { useThemeContext } from "../../contexts/ThemeProvider";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import React from "react";
import { FaSave } from "react-icons/fa";
import { useEditorContext } from "../../contexts/EditorProvider";
import { useToast } from "../ui/use-toast";
import { markdownPreviewOptions } from "../../utils/markdownPreviewOptions";
import FileDialog from "./FileDialog";

export default function Editor() {
  const { markdown, handleSafeChange, handleSave, variant } =
    useEditorContext();
  const { toast } = useToast();
  const { theme } = useThemeContext();

  const buttonText = variant === "new" ? "Save" : "Update";

  const successText =
    variant === "new"
      ? "Post created successfully."
      : "Post updated successfully.";

  const failureText =
    variant === "new" ? "Cannot create post." : "Cannot update post.";

  const customExtraCommands: ICommand[] = [
    {
      name: buttonText,
      keyCommand: buttonText,
      buttonProps: { "aria-label": buttonText, title: buttonText },
      icon: <FaSave />,
      execute: async (state, api) => {
        try {
          await handleSave();
          toast({
            title: successText
          });
        } catch (e) {
          toast({
            variant: "destructive",
            title: failureText
          });
        }
      }
    }
  ];

  const customCommands: ICommand[] = [
    {
      name: "files",
      keyCommand: "files",
      buttonProps: { "aria-label": buttonText, title: "show files" },
      icon: <FileDialog />
    }
  ];

  return (
    <div data-color-mode={theme} className="w-full">
      <MDEditor
        value={markdown}
        onChange={(text) => handleSafeChange(text || "")}
        commands={[...commands.getCommands(), ...customCommands]}
        extraCommands={[...commands.getExtraCommands(), ...customExtraCommands]}
        className="!h-[calc(100vh-5rem)] flex-grow !overflow-auto"
        highlightEnable={true}
        previewOptions={{
          components: markdownPreviewOptions
        }}
      />
    </div>
  );
}
