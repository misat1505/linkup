import { useAppContext } from "@/contexts/AppProvider";
import { ROUTES } from "@/lib/routes";
import { getAccessToken } from "@/lib/token";
import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

export default function ProtectedRoute({
  children,
}: {
  children: React.JSX.Element;
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
