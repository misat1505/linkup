import { useAppContext } from "@/contexts/AppProvider";
import Loading from "./Loading";
import { getAccessToken } from "@/lib/token";
import { ROUTES } from "@/lib/routes";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { isLoading, user } = useAppContext();

  if (isLoading) {
    return <Loading />;
  }

  if (!user || !getAccessToken()) {
    return <Navigate to={ROUTES.LOGIN.$path()} />;
  }

  return children;
}
