import React, { createContext, PropsWithChildren, useContext } from "react";
import useNewGroupChatForm, {
  useNewGroupChatFormValue
} from "../hooks/chats/useGroupChatCreationForm";

type GroupChatFormContextProps = PropsWithChildren;

type GroupChatFormContextValue = useNewGroupChatFormValue;

const GroupChatFormContext = createContext<GroupChatFormContextValue>(
  {} as GroupChatFormContextValue
);

export const useGroupChatFormContext = () => useContext(GroupChatFormContext);

export const GroupChatFormProvider = ({
  children
}: GroupChatFormContextProps) => {
  return (
    <GroupChatFormContext.Provider value={useNewGroupChatForm()}>
      {children}
    </GroupChatFormContext.Provider>
  );
};

export default GroupChatFormProvider;
