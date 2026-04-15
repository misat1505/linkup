import { ClipLoader } from "react-spinners";
import { useLoginFormContext } from "../providers/LoginFormProvider";
import { Button } from "@/components/ui/button";
import { I18nText } from "@/components/shared/I18nText";

export default function LoginFormSubmitButton() {
  const { isSubmitting } = useLoginFormContext();

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
              <I18nText translationKey="login.form.submit.pending" />
            </p>
          </div>
        ) : (
          <p>
            <I18nText translationKey="login.form.submit.idle" />
          </p>
        )}
      </Button>
    </div>
  );
}
