import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm
} from "react-hook-form";
import { useToast } from "../../components/ui/use-toast";
import { chatFormSchema, ChatFormType } from "../../validators/chat.validators";
import { createMessage } from "../../api/chatAPI";
import { Chat } from "../../models/Chat";
import { useChatPageContext } from "../../contexts/ChatPageProvider";
import { socketClient } from "../../lib/socketClient";

type ChatFormEntries = {
  content: string;
};

export type useChatFormValue = {
  register: UseFormRegister<ChatFormEntries>;
  errors: FieldErrors<ChatFormEntries>;
  isSubmitting: boolean;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

export default function useChatForm(chatId: Chat["id"]): useChatFormValue {
  const { addMessage } = useChatPageContext();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ChatFormType>({
    resolver: zodResolver(chatFormSchema)
  });

  const onSubmit: SubmitHandler<ChatFormType> = async (data) => {
    try {
      const message = await createMessage(chatId, data);
      reset();
      addMessage(message);
      socketClient.sendMessage(message, chatId);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: "Cannot send a message.",
          description: e.response?.data.message,
          variant: "destructive"
        });
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return {
    register,
    errors,
    isSubmitting,
    submitForm
  };
}
