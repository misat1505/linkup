import { useAppContext } from "@/contexts/app-provider";
import { ROUTES } from "@/lib/routes";
import { Loading } from "@packages/ui/components/misc/loading";
import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

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

  if (user === null) {
    return <Navigate to={ROUTES.LOGIN.$path()} />;
  }

  return children;
}
