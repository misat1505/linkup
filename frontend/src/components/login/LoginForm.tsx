import { useLoginFormContext } from "@/contexts/LoginFormProvider";
import LoginFormFields from "./LoginFormFields";
import LoginFormSubmitButton from "./LoginFormSubmitButton";

export default function LoginForm() {
  const { submitForm } = useLoginFormContext();

  return (
    <form onSubmit={submitForm}>
      <LoginFormFields />
      <LoginFormSubmitButton />
    </form>
  );
}
