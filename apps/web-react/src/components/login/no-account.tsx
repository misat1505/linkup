import { ROUTES } from "@/lib/routes";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function NoAccount() {
  const { t } = useTranslation();

  return (
    <p className="mt-4 text-center text-sm">
      {t("login.no-account")}{" "}
      <Link className="text-blue-700 underline" to={ROUTES.SIGNUP.$path()}>
        {t("login.sign-in-redirect")}
      </Link>
    </p>
  );
}
