import { Post } from "../types/Post";
import {
  decodeHTMLEntities,
  sanitizeMarkdownWithCodeBlocks
} from "../utils/editorUtils";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { PostService } from "../services/Post.service";

type EditorContextConfig =
  | {
      variant: "new";
    }
  | {
      variant: "update";
      post: Post;
    };

type EditorContextProps = PropsWithChildren & EditorContextConfig;

type EditorContextProvidedValues = {
  markdown: Post["content"];
  handleSafeChange: (text: Post["content"]) => void;
  variant: "new" | "update";
  handleSave: () => Promise<Post>;
};

const EditorContext = createContext<EditorContextProvidedValues | undefined>(
  undefined
);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined)
    throw new Error("useEditorContext called outside its provider.");
  return context;
};

const EditorProvider = ({ children, ...props }: EditorContextProps) => {
  const [markdown, setMarkdown] = useState(
    props.variant === "update" ? props.post.content : ""
  );

  const handleSafeChange = (text: string) => {
    setMarkdown(decodeHTMLEntities(sanitizeMarkdownWithCodeBlocks(text)));
  };

  const handleSave = async (): Promise<Post> => {
    if (props.variant === "new") {
      return await PostService.createPost(markdown);
    }

    return await PostService.updatePost({
      id: props.post.id,
      content: markdown
    });
  };

  return (
    <EditorContext.Provider
      value={{
        markdown,
        handleSafeChange,
        variant: props.variant,
        handleSave
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
