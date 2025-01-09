import { useLoginFormContext } from "@/contexts/LoginFormProvider";
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";

export default function LoginFormSubmitButton() {
  const { isSubmitting } = useLoginFormContext();

  return (
    <div className="mt-4 flex justify-center">
      <Button
        variant="blueish"
        type="submit"
        disabled={isSubmitting}
        data-testid="cy-login-form-button"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>Signing in...</p>
          </div>
        ) : (
          <p>Sign in</p>
        )}
      </Button>
    </div>
  );
}
