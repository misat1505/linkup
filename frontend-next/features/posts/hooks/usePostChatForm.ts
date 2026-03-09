"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { queryKeys } from "@/lib/queryKeys";
import { Message } from "@/features/chats/schemas/message";
import { Chat } from "@/features/chats/schemas/chat";
import { useQueryClient } from "@tanstack/react-query";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { createMessage } from "@/features/chats/actions/createMessage";
import {
  chatFormSchema,
  ChatFormType,
} from "@/features/chats/schemas/chatForm";

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
    e?: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>;
};

export default function usePostChatForm(
  chatId: Chat["id"],
): usePostChatFormValue {
  const { t } = useLanguageContext();
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
      queryClient.setQueryData<Message[]>(
        queryKeys.messages(message.chatId, message.response?.id || null),
        (oldMessages) => {
          if (!oldMessages) return [message];
          return [...oldMessages, message];
        },
      );
      setResponseInner(null);
      toast({
        title: t("posts.comments.form.toasts.success.title"),
      });
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: t("posts.comments.form.toasts.error.title"),
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
    response,
  };
}
