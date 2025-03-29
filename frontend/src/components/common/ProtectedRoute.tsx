import { useAppContext } from "@/contexts/AppProvider";
import Loading from "./Loading";
import { getAccessToken } from "@/lib/token";
import { ROUTES } from "@/lib/routes";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isLoading, user } = useAppContext();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="relative w-screen h-[calc(100vh-5rem)] text-nowrap">
        <Loading text={t("common.loading")} />
      </div>
    );
  }

  if (!user || !getAccessToken()) {
    return <Navigate to={ROUTES.LOGIN.$path()} />;
  }

  return children;
}
