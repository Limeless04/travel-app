import { useNavigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../store/useAuthStore";
import { useEffect } from "react";

interface ProtectedRouteProps {
  redirectTo?: string;
}

const AuthGuard = ({ redirectTo = "/auth/login" }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthStore();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      const isSessionExpired =
        new URLSearchParams(location.search).get("expired") === "true";
      if (!isSessionExpired) {
        navigate(redirectTo, { state: { from: location, authRedirect: true } });
      }
    }
  }, [isAuthenticated, loading, navigate, redirectTo, location]);

  if (loading) {
    return <div>Loading..</div>;
  }

  return <Outlet />;
};

export default AuthGuard;
