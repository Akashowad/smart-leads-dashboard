import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const ProtectedRoute = () => {
  const { user, bootstrapping } = useAuth();

  if (bootstrapping) {
    return <div className="min-h-screen bg-slate-50 p-8 text-slate-700 dark:bg-slate-950 dark:text-slate-200">Loading workspace...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};
