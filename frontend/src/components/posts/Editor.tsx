import { useEditorContext } from "@/contexts/EditorProvider";
import MDEditor, { ICommand, commands } from "@uiw/react-md-editor";
import { FaSave } from "react-icons/fa";
import { useToast } from "../ui/use-toast";
import { useThemeContext } from "@/contexts/ThemeProvider";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { Post } from "@/types/Post";
import { ROUTES } from "@/lib/routes";
import FileDialog from "./FileDialog";
import { markdownPreviewOptions } from "@/utils/markdownPreviewOptions";

export default function Editor() {
  const { markdown, handleSafeChange, handleSave, variant } =
    useEditorContext();
  const { toast } = useToast();
  const { theme } = useThemeContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      execute: async (_, __) => {
        try {
          const post = await handleSave();
          queryClient.setQueryData<Post>(
            ["posts", { postId: post.id }],
            () => ({
              ...post,
            })
          );
          handleSafeChange(post.content);
          navigate(
            ROUTES.POST_EDITOR.$buildPath({ params: { postId: post.id } })
          );
          toast({
            title: successText,
          });
        } catch (e) {
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
      icon: <FileDialog content={markdown} />,
    },
  ];

  return (
    <div data-color-mode={theme} className="w-full">
      <MDEditor
        data-testid="cy-post-editor"
        value={markdown}
        onChange={(text) => handleSafeChange(text || "")}
        commands={[...commands.getCommands(), ...customCommands]}
        extraCommands={[...commands.getExtraCommands(), ...customExtraCommands]}
        className="!h-[calc(100vh-5rem)] flex-grow !overflow-auto"
        highlightEnable={true}
        previewOptions={{
          components: markdownPreviewOptions,
        }}
      />
    </div>
  );
}
