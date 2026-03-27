import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { ApiError, apiRequest } from "../lib/api";

export type OrganizationSummary = {
  id: string;
  name: string;
  slug: string;
  role: string;
};

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  activeOrganizationId: string | null;
  organizations: OrganizationSummary[];
};

type AuthResponse = {
  user: AuthUser;
};

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
  organizationName: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    void refreshSession();
  }, []);

  async function refreshSession() {
    try {
      const response = await apiRequest<AuthResponse>("/auth/me");
      setUser(response.user);
      setStatus("authenticated");
    } catch (error) {
      setUser(null);
      setStatus("unauthenticated");

      if (!(error instanceof ApiError) || error.status !== 401) {
        console.error(error);
      }
    }
  }

  async function login(input: LoginInput) {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: input,
    });

    setUser(response.user);
    setStatus("authenticated");
  }

  async function register(input: RegisterInput) {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: input,
    });

    setUser(response.user);
    setStatus("authenticated");
  }

  async function logout() {
    await apiRequest<void>("/auth/logout", {
      method: "POST",
    });

    setUser(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        status,
        login,
        register,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return value;
}
