import { Post } from "@packages/schemas";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import usePostChatForm, {
  usePostChatFormValue,
} from "../hooks/use-post-chat-form";

type PostCommentsSectionContextProps = PropsWithChildren & {
  chat: Post["chat"];
};

type PostCommentsSectionContextProvidedValues = usePostChatFormValue & {
  chat: Post["chat"];
  isCommentSectionOpen: boolean;
  toggleIsCommentSectionOpen: () => void;
};

const PostCommentsSectionContext = createContext<
  PostCommentsSectionContextProvidedValues | undefined
>(undefined);

export const usePostCommentsSectionContext = () => {
  const context = useContext(PostCommentsSectionContext);
  if (context === undefined)
    throw new Error(
      "usePostCommentsSectionContext called outside its provider.",
    );
  return context;
};

const PostCommentsSectionProvider = ({
  children,
  chat,
}: PostCommentsSectionContextProps) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const toggleIsCommentSectionOpen = () =>
    setIsCommentSectionOpen((prev) => !prev);

  return (
    <PostCommentsSectionContext.Provider
      value={{
        ...usePostChatForm(chat.id),
        chat,
        isCommentSectionOpen,
        toggleIsCommentSectionOpen,
      }}
    >
      {children}
    </PostCommentsSectionContext.Provider>
  );
};

export default PostCommentsSectionProvider;
