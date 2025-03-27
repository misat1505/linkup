import { useSignupFormContext } from "@/contexts/SignupFormProvider";
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

export default function SignupSubmitButton() {
  const { t } = useTranslation();
  const { isSubmitting, type } = useSignupFormContext();

  const loadingText =
    type === "create"
      ? t("signup.form.submit.pending")
      : t("settings.form.submit.pending");
  const text =
    type === "create"
      ? t("signup.form.submit.idle")
      : t("settings.form.submit.idle");

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
