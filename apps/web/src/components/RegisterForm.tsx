import { useState, type FormEvent } from "react";

type RegisterFormProps = {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (input: {
    fullName: string;
    email: string;
    password: string;
    organizationName: string;
  }) => Promise<void>;
  onSwitchMode: () => void;
};

export function RegisterForm({ isSubmitting, error, onSubmit, onSwitchMode }: RegisterFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({ fullName, email, password, organizationName });
  }

  return (
    <div className="auth-card">
      <div className="card-header">
        <p className="eyebrow">Create an account</p>
        <h2>Start a new org workspace</h2>
        <p>The first user becomes the org owner and lands directly in the authenticated app shell.</p>
      </div>

      <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
        <label>
          <span>Full name</span>
          <input
            autoComplete="name"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />
        </label>

        <label>
          <span>Work email</span>
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
          <span>Organization name</span>
          <input
            name="organizationName"
            type="text"
            value={organizationName}
            onChange={(event) => setOrganizationName(event.target.value)}
            required
          />
        </label>

        <label>
          <span>Password</span>
          <input
            autoComplete="new-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <button className="primary-button" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>

      <button className="ghost-button" type="button" onClick={onSwitchMode}>
        Already have access? Sign in
      </button>
    </div>
  );
}
