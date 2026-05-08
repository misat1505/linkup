import { zodResolver } from "@hookform/resolvers/zod";
import {
  FieldErrors,
  UseFormProps,
  UseFormRegister,
  UseFormSetValue,
  useForm,
} from "react-hook-form";
import {
  SignupFormType,
  useSignupFormSchema,
} from "../schemas/auth.validators";

export type SignupFormEntries = {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  confirmPassword: string;
  file: File | null;
};

type FormSubmitEvent =
  | React.BaseSyntheticEvent<object, unknown, unknown>
  | undefined;

export type useSubmitFormValue = {
  register: UseFormRegister<SignupFormEntries>;
  errors: FieldErrors<SignupFormEntries>;
  isSubmitting: boolean;
  file: File | null;
  submitForm: (e?: FormSubmitEvent) => Promise<void>;
  removeFile: () => void;
  data: SignupFormEntries;
  setValue: UseFormSetValue<SignupFormEntries>;
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

  // eslint-disable-next-line react-hooks/incompatible-library
  const data = watch();
  const file = data.file;

  const removeFile = () => {
    setValue("file", null);
  };

  return {
    register,
    errors,
    isSubmitting,
    file,
    submitForm,
    removeFile,
    data,
    setValue,
  };
}
