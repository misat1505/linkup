import { ClipLoader } from "react-spinners";
import { TRANSLATION_COMPONENT } from "../../../config";
import { Button } from "../../shadcn";

type SignupSubmitButtonProps = {
  isSubmitting: boolean;
  type: "create" | "modify";
};

export function SignupSubmitButton({
  type,
  isSubmitting,
}: SignupSubmitButtonProps) {
  const loadingText =
    type === "create" ? (
      <TRANSLATION_COMPONENT translationKey="signup.form.submit.pending" />
    ) : (
      <TRANSLATION_COMPONENT translationKey="settings.form.submit.pending" />
    );
  const text =
    type === "create" ? (
      <TRANSLATION_COMPONENT translationKey="signup.form.submit.idle" />
    ) : (
      <TRANSLATION_COMPONENT translationKey="settings.form.submit.idle" />
    );

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
