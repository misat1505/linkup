import { SignupSubmitButton } from "@packages/ui/components/features/signup/signup-submit-button";
import { useSignupFormContext } from "../providers/signup-form-provider";
import SignupFormFields from "./signup-form-fields";
import SignupImageFormField from "./signup-image-form-field";

export default function SignupForm() {
  const { submitForm, isSubmitting, type } = useSignupFormContext();

  return (
    <form onSubmit={submitForm}>
      <div className="grid-cols-2 gap-x-4 md:grid">
        <SignupFormFields />
        <SignupImageFormField />
      </div>
      <SignupSubmitButton isSubmitting={isSubmitting} type={type} />
    </form>
  );
}
