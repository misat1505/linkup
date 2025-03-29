import { useSignupFormContext } from "@/contexts/SignupFormProvider";
import { SignupFormType } from "@/validators/auth.validators";
import FormField from "../common/forms/FormField";
import { useTranslation } from "react-i18next";

export default function SignupFormFields() {
  const { t } = useTranslation();
  const { register, errors } = useSignupFormContext();

  const renderFormField = (
    name: keyof SignupFormType,
    placeholder: string,
    type = "text"
  ) => (
    <FormField
      {...register(name)}
      placeholder={placeholder}
      type={type}
      error={errors[name]?.message}
      data-testid={`cy-signup-form-${name}`}
    />
  );

  return (
    <div>
      {renderFormField("firstName", t("signup.form.placeholders.firstname"))}
      {renderFormField("lastName", t("signup.form.placeholders.lastname"))}
      {renderFormField("login", t("signup.form.placeholders.login"))}
      {renderFormField(
        "password",
        t("signup.form.placeholders.password"),
        "password"
      )}
      {renderFormField(
        "confirmPassword",
        t("signup.form.placeholders.confirm-password"),
        "password"
      )}
    </div>
  );
}
