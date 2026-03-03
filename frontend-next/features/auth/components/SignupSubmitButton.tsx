import { useLanguageContext } from "@/providers/LanguageProvider";
import { ClipLoader } from "react-spinners";
import { useSignupFormContext } from "../providers/SignupFormProvider";
import { Button } from "@/components/ui/button";
import { I18nText } from "@/components/shared/I18nText";

export default function SignupSubmitButton() {
  const { t } = useLanguageContext();
  const { isSubmitting, type } = useSignupFormContext();

  const loadingText =
    type === "create" ? (
      <I18nText translationKey="signup.form.submit.pending" />
    ) : (
      <I18nText translationKey="settings.form.submit.pending" />
    );
  const text =
    type === "create" ? (
      <I18nText translationKey="signup.form.submit.idle" />
    ) : (
      <I18nText translationKey="settings.form.submit.idle" />
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
