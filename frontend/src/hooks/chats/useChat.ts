import { Chat } from "../../models/Chat";
import { Message } from "../../models/Message";
import { useQueryClient } from "react-query";

type useChatType = {
  addMessage: (message: Message) => void;
};

export default function useChat(chatId: Chat["id"]): useChatType {
  const queryClient = useQueryClient();

  const addMessage = (message: Message): void => {
    queryClient.setQueryData<Message[]>(
      ["messages", { chatId }],
      (oldMessages) => {
        return oldMessages ? [...oldMessages, message] : [message];
      }
    );
  };

  return { addMessage };
}
