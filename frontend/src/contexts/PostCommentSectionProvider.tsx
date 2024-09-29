import { Chat } from "../types/Chat";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type PostCommentsSectionContextProps = PropsWithChildren & { chat: Chat };

type PostCommentsSectionContextProvidedValues = {
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
      "usePostCommentsSectionContext called outside its provider."
    );
  return context;
};

const PostCommentsSectionProvider = ({
  children
}: PostCommentsSectionContextProps) => {
  const [isCommentSectionOpen, setIsCommentSectionOpen] = useState(false);

  const toggleIsCommentSectionOpen = () =>
    setIsCommentSectionOpen((prev) => !prev);

  return (
    <PostCommentsSectionContext.Provider
      value={{
        isCommentSectionOpen,
        toggleIsCommentSectionOpen
      }}
    >
      {children}
    </PostCommentsSectionContext.Provider>
  );
};

export default PostCommentsSectionProvider;
