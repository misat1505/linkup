"use client";
import { createContext, PropsWithChildren, useContext } from "react";
import useNewGroupChatForm, {
	useNewGroupChatFormValue,
} from "../hooks/use-group-chat-creation-form";

type GroupChatFormContextProps = PropsWithChildren;

type GroupChatFormContextValue = useNewGroupChatFormValue;

const GroupChatFormContext = createContext<GroupChatFormContextValue>(
	{} as GroupChatFormContextValue,
);

export const useGroupChatFormContext = () => useContext(GroupChatFormContext);

const GroupChatFormProvider = ({ children }: GroupChatFormContextProps) => {
	return (
		<GroupChatFormContext.Provider value={useNewGroupChatForm()}>
			{children}
		</GroupChatFormContext.Provider>
	);
};

export default GroupChatFormProvider;
