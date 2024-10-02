import { Post } from "../types/Post";
import {
  decodeHTMLEntities,
  sanitizeMarkdownWithCodeBlocks
} from "../utils/editorUtils";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { PostService } from "../services/Post.service";
import { useQueryClient } from "react-query";
import { queryKeys } from "../lib/queryKeys";

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
  const queryClient = useQueryClient();
  const [markdown, setMarkdown] = useState(
    props.variant === "update" ? props.post.content : ""
  );

  const handleSafeChange = (text: string) => {
    setMarkdown(decodeHTMLEntities(sanitizeMarkdownWithCodeBlocks(text)));
  };

  const handleSave = async (): Promise<Post> => {
    if (props.variant === "new") {
      const post = await PostService.createPost(markdown);
      queryClient.invalidateQueries(queryKeys.posts());
      queryClient.invalidateQueries(queryKeys.myPosts());
      return post;
    }

    const post = await PostService.updatePost({
      id: props.post.id,
      content: markdown
    });
    queryClient.invalidateQueries(queryKeys.posts());
    queryClient.invalidateQueries(queryKeys.myPosts());
    return post;
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
