import { useSignupFormContext } from "@/contexts/SignupFormProvider";
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";

export default function SignupSubmitButton() {
  const { isSubmitting, type } = useSignupFormContext();

  const loadingText = type === "create" ? "Signing up..." : "Updating...";
  const text = type === "create" ? "Sign up" : "Update";

  return (
    <div className="mt-8 flex justify-center">
      <Button
        type="submit"
        disabled={isSubmitting}
        data-testid="cy-signup-form-button"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>{loadingText}</p>
          </div>
        ) : (
          <p>{text}</p>
        )}
      </Button>
    </div>
  );
}
