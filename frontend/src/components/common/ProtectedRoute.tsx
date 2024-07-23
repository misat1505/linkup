import { useAppContext } from "../../contexts/AppProvider";
import { Navigate } from "react-router-dom";
import React from "react";
import Loading from "./Loading";

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
    return <Navigate to="/login" />;
  }

  return children;
}
