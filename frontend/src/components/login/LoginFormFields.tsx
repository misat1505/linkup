import { useLoginFormContext } from "@/contexts/LoginFormProvider";
import { LoginFormType } from "@/validators/auth.validators";
import FormField from "../common/forms/FormField";

export default function LoginFormFields() {
  const { register, errors } = useLoginFormContext();

  const renderFormField = (
    name: keyof LoginFormType,
    placeholder: string,
    type = "text"
  ) => (
    <FormField
      {...register(name)}
      placeholder={placeholder}
      type={type}
      error={errors[name]?.message}
      data-testid={`cy-login-form-${name}`}
    />
  );

  return (
    <div>
      {renderFormField("login", "Login")}
      {renderFormField("password", "Password", "password")}
    </div>
  );
}
