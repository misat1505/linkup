import { useSignupFormContext } from "@/contexts/SignupFormProvider";
import SignupFormFields from "./SignupFormFields";
import SignupImageFormField from "./SignupImageFormField";
import SignupSubmitButton from "./SignupSubmitButton";

export default function SignupForm() {
  const { submitForm } = useSignupFormContext();

  return (
    <form onSubmit={submitForm}>
      <div className="grid-cols-2 gap-x-4 md:grid">
        <SignupFormFields />
        <SignupImageFormField />
      </div>
      <SignupSubmitButton />
    </form>
  );
}
