import {
  SignupFormType,
  signupFormSchema
} from "../../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  UseFormProps,
  UseFormRegister,
  useForm
} from "react-hook-form";

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

export type useSignupFormProps = UseFormProps<SignupFormType> & {
  onSubmit: (data: SignupFormEntries) => void;
};

export default function useSignupForm({
  onSubmit,
  ...formOptions
}: useSignupFormProps): useSubmitFormValue {
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
