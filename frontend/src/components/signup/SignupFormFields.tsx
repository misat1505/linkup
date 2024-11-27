import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import FormField from "../common/forms/FormField";
import { SignupFormType } from "../../validators/auth.validators";

export default function SignupFormFields() {
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
      {renderFormField("firstName", "First name")}
      {renderFormField("lastName", "Last name")}
      {renderFormField("login", "Login")}
      {renderFormField("password", "Password", "password")}
      {renderFormField("confirmPassword", "Confirm Password", "password")}
    </div>
  );
}
