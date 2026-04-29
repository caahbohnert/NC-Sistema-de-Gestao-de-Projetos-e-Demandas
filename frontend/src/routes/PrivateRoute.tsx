import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface Props {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: Props) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
