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
  UseFormWatch,
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
  watch: UseFormWatch<SignupFormEntries>;
  submitForm: (
    e?: React.BaseSyntheticEvent<object, any, any> | undefined
  ) => Promise<void>;
};

export default function useSignupForm(): useSubmitFormValue {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit: SubmitHandler<SignupFormType> = async (data) => {
    try {
      await signupUser(data);
      navigate("/");
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }
    }
  };

  const submitForm = handleSubmit(onSubmit);

  return {
    register,
    errors,
    isSubmitting,
    watch,
    submitForm,
  };
}
