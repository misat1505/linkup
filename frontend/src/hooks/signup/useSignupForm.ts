import { useAppContext } from "../../contexts/AppProvider";
import {
  SignupFormType,
  signupFormSchema
} from "../../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  UseFormProps,
  UseFormRegister,
  useForm
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";
import { ROUTES } from "../../lib/routes";
import { AuthService } from "../../services/Auth.service";

export type SignupFormEntries = {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  confirmPassword: string;
  file?: FileList | undefined;
};

export type useSubmitFormValue = {
  register: UseFormRegister<SignupFormEntries>;
  errors: FieldErrors<SignupFormEntries>;
  isSubmitting: boolean;
  file: File | null;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
  removeFile: () => void;
};

export type useSignupFormProps = UseFormProps<SignupFormType>;

export default function useSignupForm(
  formOptions: useSignupFormProps = {}
): useSubmitFormValue {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAppContext();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
    ...formOptions
  });

  const onSubmit: SubmitHandler<SignupFormType> = async (data) => {
    try {
      const user = await AuthService.signup(data);
      setUser(user);
      navigate(ROUTES.HOME.path);
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast({
          title: "Cannot create new account.",
          description: e.response?.data.message,
          variant: "destructive"
        });
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  const file = watch()?.file?.[0] || null;

  const removeFile = () => {
    setValue("file", undefined);
  };

  return {
    register,
    errors,
    isSubmitting,
    file,
    submitForm,
    removeFile
  };
}
