"use client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { LoginFormType, useLoginFormSchema } from "../schemas/auth.validators";
import { loginUser } from "../actions/loginUser";
import { useAppContext } from "@/providers/AppProvider";
import { sleep } from "@/utils/sleep";

type LoginFormEntries = {
  login: string;
  password: string;
};

type FormSubmitEvent =
  | React.BaseSyntheticEvent<object, unknown, unknown>
  | undefined;

export type useLoginFormValue = {
  register: UseFormRegister<LoginFormEntries>;
  errors: FieldErrors<LoginFormEntries>;
  isSubmitting: boolean;
  submitForm: (e?: FormSubmitEvent) => Promise<void>;
};

export default function useLoginForm(): useLoginFormValue {
  const { t } = useLanguageContext();
  const router = useRouter();
  const { toast } = useToast();
  const { invalidateCurrentUser } = useAppContext();
  const loginFormSchema = useLoginFormSchema();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    try {
      await loginUser(data);

      invalidateCurrentUser();

      // give time for cookies to be stored
      await sleep(10);
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof Error) {
        toast({
          title: t("login.error.toast.title"),
          description: e.message,
          variant: "destructive",
        });
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return {
    register,
    errors,
    isSubmitting,
    submitForm,
  };
}
