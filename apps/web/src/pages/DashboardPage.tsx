import { useAuth } from "../context/AuthContext";

export function DashboardPage() {
  const { logout, user } = useAuth();

  if (!user) {
    return null;
  }

  const activeOrganization =
    user.organizations.find((organization) => organization.id === user.activeOrganizationId) ||
    user.organizations[0] ||
    null;

  return (
    <main className="dashboard-layout">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Authenticated app shell</p>
          <h1>Welcome back, {user.fullName}</h1>
          <p className="hero-copy">
            You are signed in as <strong>{user.email}</strong>.
          </p>
        </div>

        <button className="ghost-button" type="button" onClick={() => void logout()}>
          Sign out
        </button>
      </header>

      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Active organization</p>
          <h2>{activeOrganization?.name || "No organization assigned"}</h2>
          <p>
            Slug: <strong>{activeOrganization?.slug || "n/a"}</strong>
          </p>
        </div>

        <div className="chip-row">
          {user.organizations.map((organization) => (
            <span className="chip" key={organization.id}>
              {organization.name} · {organization.role}
            </span>
          ))}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <p className="eyebrow">What ships today</p>
          <ul>
            <li>Cookie-based login and registration</li>
            <li>Users, orgs, and memberships in Postgres</li>
            <li>Protected React routes and session bootstrap</li>
            <li>Seeded starter account for fast local setup</li>
          </ul>
        </article>

        <article className="dashboard-card">
          <p className="eyebrow">Natural next steps</p>
          <ul>
            <li>
              Add feature routes under <code>apps/api/src/routes</code>
            </li>
            <li>Expand Prisma with domain tables and migrations</li>
            <li>Introduce org switching and role-based authorization</li>
            <li>Swap JWT cookies for stored sessions if you need revocation</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
