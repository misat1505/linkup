import { useAppContext } from "../../contexts/AppProvider";
import { loginUser } from "../../api/authAPI";
import {
  LoginFormType,
  loginFormSchema
} from "../../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";
import { ROUTES } from "../../lib/routes";

type LoginFormEntries = {
  login: string;
  password: string;
};

export type useLoginFormValue = {
  register: UseFormRegister<LoginFormEntries>;
  errors: FieldErrors<LoginFormEntries>;
  isSubmitting: boolean;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

export default function useLoginForm(): useLoginFormValue {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema)
  });

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    try {
      const user = await loginUser(data);
      setUser(user);
      navigate(ROUTES.HOME.path);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: "Cannot login.",
          description: e.response?.data.message,
          variant: "destructive"
        });
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return {
    register,
    errors,
    isSubmitting,
    submitForm
  };
}
