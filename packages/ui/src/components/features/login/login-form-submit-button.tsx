import { ClipLoader } from "react-spinners";
import { TRANSLATION_COMPONENT } from "../../../config";
import { Button } from "../../shadcn/button";

type LoginFormSubmitButtonProps = {
  isSubmitting: boolean;
};

export function LoginFormSubmitButton({
  isSubmitting,
}: LoginFormSubmitButtonProps) {
  return (
    <div className="mt-4 flex justify-center">
      <Button
        type="submit"
        disabled={isSubmitting}
        data-testid="cy-login-form-button"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-x-2">
            <ClipLoader size={12} color="whitesmoke" />
            <p>
              <TRANSLATION_COMPONENT translationKey="login.form.submit.pending" />
            </p>
          </div>
        ) : (
          <p>
            <TRANSLATION_COMPONENT translationKey="login.form.submit.idle" />
          </p>
        )}
      </Button>
    </div>
  );
}
