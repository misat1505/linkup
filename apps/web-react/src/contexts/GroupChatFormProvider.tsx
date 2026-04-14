import useNewGroupChatForm, {
  useNewGroupChatFormValue,
} from "@/hooks/chats/useGroupChatCreationForm";
import { createContext, PropsWithChildren, useContext } from "react";

type GroupChatFormContextProps = PropsWithChildren;

type GroupChatFormContextValue = useNewGroupChatFormValue;

const GroupChatFormContext = createContext<GroupChatFormContextValue>(
  {} as GroupChatFormContextValue
);

export const useGroupChatFormContext = () => useContext(GroupChatFormContext);

export const GroupChatFormProvider = ({
  children,
}: GroupChatFormContextProps) => {
  return (
    <GroupChatFormContext.Provider value={useNewGroupChatForm()}>
      {children}
    </GroupChatFormContext.Provider>
  );
};

export default GroupChatFormProvider;
