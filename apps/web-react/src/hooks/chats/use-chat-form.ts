import { useChatPageContext } from "@/contexts/chat-page-provider";
import { useChatContext } from "@/contexts/chat-provider";
import { socketClient } from "@/lib/socket-client";
import { ChatService } from "@/services/chat.service";
import { chatFormSchema, ChatFormType } from "@/validators/chat.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chat, Message } from "@packages/schemas";
import { useToast } from "@packages/ui/components/shadcn/use-toast";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

export type ChatFormEntries = {
  content: string;
  files?: File[] | undefined;
  responseId?: Message["id"] | null;
};

export type useChatFormValue = {
  register: UseFormRegister<ChatFormEntries>;
  errors: FieldErrors<ChatFormEntries>;
  isSubmitting: boolean;
  files: File[] | undefined;
  appendFiles: (files: File[]) => void;
  removeFile: (id: number) => void;
  setResponse: (id: Message["id"] | null) => void;
  responseId: Message["id"] | null | undefined;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, unknown, unknown> | undefined,
  ) => Promise<void>;
};

export default function useChatForm(chatId: Chat["id"]): useChatFormValue {
  const { t } = useTranslation();
  const { addMessage } = useChatPageContext();
  const { setIncomeMessageId } = useChatContext();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    getValues,
    watch,
    setValue,
  } = useForm<ChatFormType>({
    resolver: zodResolver(chatFormSchema),
  });
  const onSubmit: SubmitHandler<ChatFormType> = async (data) => {
    try {
      const message = await ChatService.createMessage(chatId, data);
      reset();
      setIncomeMessageId(null);
      addMessage(message);
      socketClient.sendMessage(message);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: t("chats.form.error.toast.title"),
          description: e.response?.data.message,
          variant: "destructive",
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
      prevFiles.filter((_, idx) => idx !== id),
    );
  };

  const setResponse = (id: Message["id"] | null) => {
    setValue("responseId", id);
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
  };
}
