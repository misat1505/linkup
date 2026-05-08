"use client";
import { useAppContext } from "@/providers/app-provider";
import { useLanguageContext } from "@/providers/language-provider";
import { sleep } from "@/utils/sleep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@packages/ui/components/shadcn/use-toast";
import { useRouter } from "next/navigation";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { loginUser } from "../actions/login-user";
import { LoginFormType, useLoginFormSchema } from "../schemas/auth.validators";

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
          description: "Invalid login credentials. Please try again.",
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
