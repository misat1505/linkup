import { useAppContext } from "../../contexts/AppProvider";
import { Navigate } from "react-router-dom";
import React from "react";
import Loading from "./Loading";
import { ROUTES } from "../../lib/routes";

export default function ProtectedRoute({
  children
}: {
  children: JSX.Element;
}) {
  const { status, user } = useAppContext();

  if (status === "loading") {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN.path} />;
  }

  return children;
}
