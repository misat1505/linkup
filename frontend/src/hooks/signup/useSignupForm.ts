import {
  useSignupFormSchema,
  SignupFormType,
} from "@/validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  UseFormProps,
  UseFormRegister,
  useForm,
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
  data: SignupFormEntries;
};

export type useSignupFormProps = UseFormProps<SignupFormType> & {
  onSubmit: (data: SignupFormEntries) => void;
};

export default function useSignupForm({
  onSubmit,
  ...formOptions
}: useSignupFormProps): useSubmitFormValue {
  const signupFormSchema = useSignupFormSchema();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
    ...formOptions,
  });

  const submitForm = handleSubmit(onSubmit);

  const data = watch();
  const file = data.file?.[0] || null;

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
    data,
  };
}
