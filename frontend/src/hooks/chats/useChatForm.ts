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

export type ChatFormEntries = {
  content: string;
  files?: File[] | undefined;
};

export type useChatFormValue = {
  register: UseFormRegister<ChatFormEntries>;
  errors: FieldErrors<ChatFormEntries>;
  isSubmitting: boolean;
  files: File[] | undefined;
  appendFiles: (files: File[]) => void;
  removeFile: (id: number) => void;
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
    formState: { errors, isSubmitting },
    getValues,
    watch,
    setValue
  } = useForm<ChatFormType>({
    resolver: zodResolver(chatFormSchema)
  });
  watch();

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

  const submitForm = handleSubmit(onSubmit);

  return {
    register,
    errors,
    isSubmitting,
    submitForm,
    files: getValues().files,
    appendFiles,
    removeFile
  };
}
