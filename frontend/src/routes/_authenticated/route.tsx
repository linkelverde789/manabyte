import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { useAuth } from "#/contexts/AuthContext";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
}
