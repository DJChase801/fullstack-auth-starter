import { useState } from "react";
import { Navigate } from "react-router-dom";

import { ApiError } from "../lib/api";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { useAuth } from "../context/AuthContext";

export function AuthPage() {
  const { login, register, status } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "loading") {
    return (
      <main className="status-screen">
        <div className="status-card">
          <p className="eyebrow">Booting session</p>
          <h1>Preparing the starter</h1>
          <p>Checking whether an existing login cookie is already present.</p>
        </div>
      </main>
    );
  }

  if (status === "authenticated") {
    return <Navigate to="/app" replace />;
  }

  async function handleLogin(input: { email: string; password: string }) {
    try {
      setIsSubmitting(true);
      setError(null);
      await login(input);
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegister(input: {
    fullName: string;
    email: string;
    password: string;
    organizationName: string;
  }) {
    try {
      setIsSubmitting(true);
      setError(null);
      await register(input);
    } catch (submitError) {
      setError(
        submitError instanceof ApiError
          ? submitError.message
          : "Unable to create your account right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-layout">
      <section className="hero-panel">
        <p className="eyebrow">Reusable starter</p>
        <h1>Full-stack auth and orgs, already wired</h1>
        <p className="hero-copy">
          This boilerplate ships with a React client, an Express API, Prisma-backed
          Postgres models, cookie auth, and a clean place to add your own domain logic.
        </p>

        <div className="hero-grid">
          <article className="hero-tile">
            <h3>Frontend</h3>
            <p>Vite, React, TypeScript, route protection, and a branded auth shell.</p>
          </article>
          <article className="hero-tile">
            <h3>Backend</h3>
            <p>Express routes, zod validation, Prisma access, and cookie-based sessions.</p>
          </article>
          <article className="hero-tile">
            <h3>Data model</h3>
            <p>Users, organizations, and memberships so future apps can grow into RBAC cleanly.</p>
          </article>
        </div>
      </section>

      <section className="auth-panel">
        {mode === "login" ? (
          <LoginForm
            error={error}
            isSubmitting={isSubmitting}
            onSubmit={handleLogin}
            onSwitchMode={() => {
              setError(null);
              setMode("register");
            }}
          />
        ) : (
          <RegisterForm
            error={error}
            isSubmitting={isSubmitting}
            onSubmit={handleRegister}
            onSwitchMode={() => {
              setError(null);
              setMode("login");
            }}
          />
        )}
      </section>
    </main>
  );
}
