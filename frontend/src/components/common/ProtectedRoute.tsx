import { useAppContext } from "../../contexts/AppProvider";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import { ROUTES } from "../../lib/routes";
import { getAccessToken } from "../../lib/token";

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
