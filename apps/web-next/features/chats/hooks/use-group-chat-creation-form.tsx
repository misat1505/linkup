"use client";
import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@packages/schemas";
import { AxiosError } from "axios";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import {
  FieldErrors,
  SubmitHandler,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { createGroupChat } from "../actions/create-group-chat";
import {
  newGroupChatFormSchema,
  NewGroupChatFormType,
} from "../schemas/chat-validators";

type GroupChatFormEntries = {
  users: User[];
  name?: string | undefined;
  file?: FileList | undefined;
};

type FormSubmitEvent =
  | React.BaseSyntheticEvent<object, unknown, unknown>
  | undefined;

export type useNewGroupChatFormValue = {
  register: UseFormRegister<GroupChatFormEntries>;
  errors: FieldErrors<GroupChatFormEntries>;
  isSubmitting: boolean;
  file: File | undefined;
  users: User[];
  appendUser: (user: User) => void;
  removeUser: (user: User) => void;
  submitForm: (e?: FormSubmitEvent) => Promise<void>;
};

export default function useNewGroupChatForm(): useNewGroupChatFormValue {
  const { t } = useLanguageContext();
  const { user: me } = useAppContext();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<NewGroupChatFormType>({
    resolver: zodResolver(newGroupChatFormSchema),
  });

  const onSubmit: SubmitHandler<NewGroupChatFormType> = async (data) => {
    try {
      const { users, file, name } = data;
      const formData = new FormData();

      formData.append("name", name ?? "");
      if (file) formData.append("file", file?.[0]);

      users.forEach((user) => {
        formData.append("users[]", user.id);
      });

      const chat = await createGroupChat(formData);
      redirect(`/chats/${chat.id}`);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: t("chats.create-new-chat.group.error.toast.title"),
          description: e.response?.data.message,
          variant: "destructive",
        });
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  useEffect(() => {
    setValue("users", [me!]);
  }, [me, setValue]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const { file: filelist, users } = watch();
  const file = filelist?.[0];

  const appendUser = (user: User) => {
    if (users.some((u) => u.id === user.id)) return;
    setValue("users", [...users, user]);
  };

  const removeUser = (user: User) => {
    if (user.id === me!.id) return;
    setValue(
      "users",
      users.filter((u) => u.id !== user.id),
    );
  };

  return {
    register,
    errors,
    isSubmitting,
    submitForm,
    file,
    users,
    appendUser,
    removeUser,
  };
}
