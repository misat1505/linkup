import { useToast } from "@/components/ui/use-toast";
import { useAppContext } from "@/contexts/AppProvider";
import { queryKeys } from "@/lib/queryKeys";
import { ROUTES } from "@/lib/routes";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { User } from "@/types/User";
import {
  newGroupChatFormSchema,
  NewGroupChatFormType,
} from "@/validators/chat.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect } from "react";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

type GroupChatFormEntries = {
  users: User[];
  name?: string | undefined;
  file?: FileList | undefined;
};

export type useNewGroupChatFormValue = {
  register: UseFormRegister<GroupChatFormEntries>;
  errors: FieldErrors<GroupChatFormEntries>;
  isSubmitting: boolean;
  file: File | undefined;
  users: User[];
  appendUser: (user: User) => void;
  removeUser: (user: User) => void;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

export default function useNewGroupChatForm(): useNewGroupChatFormValue {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      const chat = await ChatService.createGroupChat(data);
      queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
        if (oldChats?.find((c) => c.id === chat.id)) return oldChats;
        return oldChats ? [...oldChats, chat] : [chat];
      });
      navigate(ROUTES.CHAT_DETAIL.$buildPath({ params: { chatId: chat.id } }));
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: "Cannot create new group chat.",
          description: e.response?.data.message,
          variant: "destructive",
        });
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  useEffect(() => {
    setValue("users", [me!]);
  }, []);

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
      users.filter((u) => u.id !== user.id)
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
