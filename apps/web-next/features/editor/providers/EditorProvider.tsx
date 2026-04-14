"use client";
import { Post } from "@/features/posts/schemas/post";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import {
  decodeHTMLEntities,
  sanitizeMarkdownWithCodeBlocks,
} from "../utils/editorUtils";
import { createPost } from "@/features/posts/actions/createPost";
import { updatePost } from "@/features/posts/actions/updatePost";

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
  undefined,
);

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined)
    throw new Error("useEditorContext called outside its provider.");
  return context;
};

const EditorProvider = ({ children, ...props }: EditorContextProps) => {
  const [markdown, setMarkdown] = useState(
    props.variant === "update" ? props.post.content : "",
  );

  const handleSafeChange = (text: string) => {
    setMarkdown(decodeHTMLEntities(sanitizeMarkdownWithCodeBlocks(text)));
  };

  const handleSave = async (): Promise<Post> => {
    if (props.variant === "new") {
      const post = await createPost(markdown);
      return post;
    }

    const post = await updatePost({
      id: props.post.id,
      content: markdown,
    });
    return post;
  };

  return (
    <EditorContext.Provider
      value={{
        markdown,
        handleSafeChange,
        variant: props.variant,
        handleSave,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorProvider;
