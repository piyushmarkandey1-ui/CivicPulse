import type { Metadata } from "next";

// The gov-dashboard has its own sidebar navigation — the global Navbar is NOT
// rendered here. This layout wraps GovDashboardClient without adding the
// floating Navbar that is injected by the root layout.
// We achieve this by using the Next.js route-group / nested layout pattern:
// the root layout renders <Navbar /> unconditionally, so instead we use a
// pathname-based guard inside Navbar itself (see Navbar.tsx govDashboard check).

export default function GovDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
