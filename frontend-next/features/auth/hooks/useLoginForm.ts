"use client";
import { useToast } from "@/components/ui/use-toast";
import { useLanguageContext } from "@/providers/LanguageProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { LoginFormType, useLoginFormSchema } from "../schemas/auth.validators";
import { AuthService } from "../services/Auth.service";
import { loginUser } from "../actions/loginUser";

type LoginFormEntries = {
  login: string;
  password: string;
};

export type useLoginFormValue = {
  register: UseFormRegister<LoginFormEntries>;
  errors: FieldErrors<LoginFormEntries>;
  isSubmitting: boolean;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined,
  ) => Promise<void>;
};

export default function useLoginForm(): useLoginFormValue {
  const { t } = useLanguageContext();
  const router = useRouter();
  const { toast } = useToast();
  // const { setUser } = useAppContext();
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
      const user = await loginUser(data);
      // setUser(user);
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
