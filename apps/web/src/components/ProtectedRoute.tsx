import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <main className="status-screen">
        <div className="status-card">
          <p className="eyebrow">Booting session</p>
          <h1>Checking your auth state</h1>
          <p>The starter is verifying the current session cookie.</p>
        </div>
      </main>
    );
  }

  if (status !== "authenticated") {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
