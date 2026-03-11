import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { Message } from "../schemas/message";
import { Chat } from "../schemas/chat";
import { useChatPageContext } from "../providers/ChatPageProvider";
import { useChatContext } from "../providers/ChatProvider";
import { chatFormSchema, ChatFormType } from "../schemas/chatValidators";
import { createMessage } from "../actions/createMessage";
import { useLanguageContext } from "@/providers/LanguageProvider";

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
    e?: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>;
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
      // socketClient.sendMessage(message);
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
