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
import { useQueryClient } from "react-query";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
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
      await createMessage(chatId, data);
      reset();
      queryClient.invalidateQueries(["messages", { chatId }]);
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
