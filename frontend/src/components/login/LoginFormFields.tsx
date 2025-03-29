import { useLoginFormContext } from "@/contexts/LoginFormProvider";
import { LoginFormType } from "@/validators/auth.validators";
import FormField from "../common/forms/FormField";
import { useTranslation } from "react-i18next";

export default function LoginFormFields() {
  const { t } = useTranslation();
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
      {renderFormField("login", t("login.form.placeholders.login"))}
      {renderFormField(
        "password",
        t("login.form.placeholders.password"),
        "password"
      )}
    </div>
  );
}
