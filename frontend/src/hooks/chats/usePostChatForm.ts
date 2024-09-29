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
import { Chat } from "../../types/Chat";
import { Message } from "../../types/Message";
import { ChatService } from "../../services/Chat.service";
import { useQueryClient } from "react-query";
import { queryKeys } from "../../lib/queryKeys";
import { useState } from "react";

export type PostChatFormEntries = {
  content: string;
  files?: File[] | undefined;
  responseId?: Message["id"] | null;
};

export type usePostChatFormValue = {
  register: UseFormRegister<PostChatFormEntries>;
  errors: FieldErrors<PostChatFormEntries>;
  isSubmitting: boolean;
  files: File[] | undefined;
  appendFiles: (files: File[]) => void;
  removeFile: (id: number) => void;
  setResponse: (message: Message | null) => void;
  responseId: Message["id"] | null | undefined;
  response: Message | null;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

export default function usePostChatForm(
  chatId: Chat["id"]
): usePostChatFormValue {
  const queryClient = useQueryClient();
  const [response, setResponseInner] = useState<Message | null>(null);
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    getValues,
    watch,
    setValue
  } = useForm<ChatFormType>({
    resolver: zodResolver(chatFormSchema)
  });
  const onSubmit: SubmitHandler<ChatFormType> = async (data) => {
    try {
      const message = await ChatService.createMessage(chatId, data);
      reset();
      queryClient.setQueryData<Message[]>(
        queryKeys.messages(message.chatId, message.response?.id),
        (oldMessages) => {
          if (!oldMessages) return [message];
          return [...oldMessages, message];
        }
      );
      setResponseInner(null);
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

  const appendFiles = (files: File[]) => {
    const prevFiles = getValues().files || [];

    setValue("files", [...prevFiles, ...files]);
  };

  const removeFile = (id: number) => {
    const prevFiles = getValues().files || [];

    setValue(
      "files",
      prevFiles.filter((_, idx) => idx !== id)
    );
  };

  const setResponse = (message: Message | null) => {
    setResponseInner(message);
    setValue("responseId", message?.id);
  };

  const submitForm = handleSubmit(onSubmit);

  const { files, responseId } = watch();

  return {
    register,
    errors,
    isSubmitting,
    submitForm,
    files,
    responseId,
    appendFiles,
    removeFile,
    setResponse,
    response
  };
}
