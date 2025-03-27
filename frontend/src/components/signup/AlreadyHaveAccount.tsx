import { ROUTES } from "@/lib/routes";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function AlreadyHaveAccount() {
  const { t } = useTranslation();

  return (
    <p className="mt-4 text-center text-sm">
      {t("signup.already-have-account")}{" "}
      <Link className="text-blue-700 underline" to={ROUTES.LOGIN.$path()}>
        {t("signup.login-redirect")}
      </Link>
    </p>
  );
}
