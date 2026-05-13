import { socketClient } from "@/lib/socket-client";
import { useLanguageContext } from "@/providers/language-provider";
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
import { createMessage } from "../actions/create-message";
import { useChatPageContext } from "../providers/chat-page-provider";
import { useChatContext } from "../providers/chat-provider";
import { chatFormSchema, ChatFormType } from "../schemas/chat-validators";

type ChatFormEntries = {
  content: string;
  files?: File[] | undefined;
  responseId?: Message["id"] | null;
};

type FormSubmitEvent =
  | React.BaseSyntheticEvent<object, unknown, unknown>
  | undefined;

export type useChatFormValue = {
  register: UseFormRegister<ChatFormEntries>;
  errors: FieldErrors<ChatFormEntries>;
  isSubmitting: boolean;
  files: File[] | undefined;
  appendFiles: (files: File[]) => void;
  removeFile: (id: number) => void;
  setResponse: (id: Message["id"] | null) => void;
  responseId: Message["id"] | null | undefined;
  submitForm: (e?: FormSubmitEvent) => Promise<void>;
};

export default function useChatForm(chatId: Chat["id"]): useChatFormValue {
  const { t } = useLanguageContext();
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
      const formData = new FormData();
      formData.append("content", data.content);
      if (data.responseId) formData.append("responseId", data.responseId);

      data.files?.forEach((file) => {
        formData.append("files", file);
      });

      const message = await createMessage(chatId, formData);
      reset();
      setIncomeMessageId(null);
      addMessage(message);
      socketClient.sendMessage(message);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: t("chats.form.error.toast.title"),
          description: "Failed to send message. Please try again.",
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

  // eslint-disable-next-line react-hooks/incompatible-library
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
