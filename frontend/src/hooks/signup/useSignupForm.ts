import { useAppContext } from "../../contexts/AppProvider";
import { signupUser } from "../../api/authAPI";
import {
  SignupFormType,
  signupFormSchema,
} from "../../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import {
  FieldErrors,
  SubmitHandler,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
  const { setUser } = useAppContext();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit: SubmitHandler<SignupFormType> = async (data) => {
    try {
      const user = await signupUser(data);
      setUser(user);
      navigate("/");
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
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
    removeFile,
  };
}
