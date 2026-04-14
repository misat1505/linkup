import { useLoginFormContext } from "@/contexts/LoginFormProvider";
import { Button } from "../ui/button";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";

export default function LoginFormSubmitButton() {
  const { t } = useTranslation();
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
            <p>{t("login.form.submit.pending")}</p>
          </div>
        ) : (
          <p>{t("login.form.submit.idle")}</p>
        )}
      </Button>
    </div>
  );
}
