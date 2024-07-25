import { useAppContext } from "../../contexts/AppProvider";
import { signupUser } from "../../api/authAPI";
import {
  SignupFormType,
  signupFormSchema
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

type SignupFormEntries = {
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

export default function useSignupForm(): useSubmitFormValue {
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
    resolver: zodResolver(signupFormSchema)
  });

  const onSubmit: SubmitHandler<SignupFormType> = async (data) => {
    try {
      const user = await signupUser(data);
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
