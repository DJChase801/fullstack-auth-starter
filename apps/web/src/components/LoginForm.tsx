import { useState, type FormEvent } from "react";

type LoginFormProps = {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (input: { email: string; password: string }) => Promise<void>;
  onSwitchMode: () => void;
};

export function LoginForm({ isSubmitting, error, onSubmit, onSwitchMode }: LoginFormProps) {
  const [email, setEmail] = useState("owner@example.com");
  const [password, setPassword] = useState("ChangeMe123!");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ email, password });
  }

  return (
    <div className="auth-card">
      <div className="card-header">
        <p className="eyebrow">Sign in</p>
        <h2>Resume where you left off</h2>
        <p>Use the seeded account or switch to registration to create a fresh org.</p>
      </div>

      <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          <span>Email</span>
          <input
            autoComplete="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            autoComplete="current-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <button className="ghost-button" type="button" onClick={onSwitchMode}>
        Need an account? Create your org
      </button>
    </div>
  );
}
