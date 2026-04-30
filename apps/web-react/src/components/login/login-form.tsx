import { useLoginFormContext } from "@/contexts/login-form-provider";
import { LoginFormSubmitButton } from "@packages/ui";
import LoginFormFields from "./login-form-fields";

export default function LoginForm() {
  const { submitForm, isSubmitting } = useLoginFormContext();

  return (
    <form onSubmit={submitForm}>
      <LoginFormFields />
      <LoginFormSubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
