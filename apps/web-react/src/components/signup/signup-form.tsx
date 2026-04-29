import { useSignupFormContext } from "@/contexts/signup-form-provider";
import SignupFormFields from "./signup-form-fields";
import SignupImageFormField from "./signup-image-form-field";
import SignupSubmitButton from "./signup-submit-button";

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
