import useNewGroupChatForm, {
	useNewGroupChatFormValue,
} from "@/hooks/chats/use-group-chat-creation-form";
import { createContext, PropsWithChildren, useContext } from "react";

type GroupChatFormContextProps = PropsWithChildren;

type GroupChatFormContextValue = useNewGroupChatFormValue;

const GroupChatFormContext = createContext<GroupChatFormContextValue>(
	{} as GroupChatFormContextValue,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useGroupChatFormContext = () => useContext(GroupChatFormContext);

const GroupChatFormProvider = ({ children }: GroupChatFormContextProps) => {
	return (
		<GroupChatFormContext.Provider value={useNewGroupChatForm()}>
			{children}
		</GroupChatFormContext.Provider>
	);
};

export default GroupChatFormProvider;
