import { useLanguageContext } from "@/providers/language-provider";
import { FormField } from "@packages/ui/components/forms/form-field";
import { useSignupFormContext } from "../providers/signup-form-provider";
import { SignupFormType } from "../schemas/auth.validators";

export default function SignupFormFields() {
  const { t } = useLanguageContext();
  const { register, errors } = useSignupFormContext();

  const renderFormField = (
    name: keyof SignupFormType,
    placeholder: string,
    type = "text",
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
        "password",
      )}
      {renderFormField(
        "confirmPassword",
        t("signup.form.placeholders.confirm-password"),
        "password",
      )}
    </div>
  );
}
