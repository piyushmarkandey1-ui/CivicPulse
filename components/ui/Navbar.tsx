"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="10" r="2.5" fill="#D98B52" />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        fill="rgba(217, 139, 82, 0.15)"
        stroke="#D98B52"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-4 h-3.5 flex flex-col justify-between" aria-hidden>
      <span
        className={cn(
          "block h-px rounded-full bg-slate-400 transition-all duration-300 origin-center",
          open && "rotate-45 translate-y-[7px]"
        )}
      />
      <span
        className={cn(
          "block h-px rounded-full bg-slate-400 transition-all duration-300",
          open && "opacity-0 scale-x-0"
        )}
      />
      <span
        className={cn(
          "block h-px rounded-full bg-slate-400 transition-all duration-300 origin-center",
          open && "-rotate-45 -translate-y-[7px]"
        )}
      />
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, profile, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleReportClick = (e: React.MouseEvent) => {
    if (pathname === "/map") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("open-report-modal"));
    }
  };

  const navLinks = [{ label: "Home", href: "/" }];
  if (role === "government") {
    navLinks.push({ label: "Gov Dashboard", href: "/gov-dashboard" });
    navLinks.push({ label: "Live Map Radar", href: "/map" });
  } else if (role === "citizen") {
    navLinks.push({ label: "Live Map", href: "/map" });
    navLinks.push({ label: "My Reports", href: "/profile" });
  } else if (!user) {
    navLinks.push({ label: "Live Map", href: "/map" });
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-400",
          scrolled ? "border-b border-white/[0.05] py-3" : "bg-transparent py-4"
        )}
        style={
          scrolled
            ? { background: "rgba(18,17,16,0.92)", backdropFilter: "blur(24px)" }
            : undefined
        }
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="CivicPulse home"
          >
            <LogoIcon />
            <span className="font-semibold text-[15px] tracking-tight">
              <span className="text-text-primary">Civic</span>
              <span className="text-copper">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1" role="navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-md text-sm transition-colors duration-200",
                      active ? "text-copper font-medium" : "text-text-muted hover:text-text-primary"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-md bg-copper/[0.08] border border-copper/[0.18]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Auth */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-3">
            {!loading && !user && (
              <>
                <Link
                  href="/login"
                  className="text-xs font-semibold text-text-secondary hover:text-white px-3 py-2 transition-colors"
                >
                  Citizen Sign In
                </Link>
                <Link
                  href="/gov-login"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>🛡️</span>
                  <span>Gov Portal</span>
                </Link>
                <Link
                  href="/signup"
                  className="text-xs font-bold px-3.5 py-2 rounded-lg bg-copper text-[#0D0D0C] hover:bg-copper-light transition-colors duration-200 shadow-sm"
                >
                  Join Citizen Watch
                </Link>
              </>
            )}

            {!loading && user && (
              <div className="flex items-center gap-3">
                {/* Role Badge Indicator */}
                {role === "government" ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <span>🛡️</span>
                    <span className="max-w-[120px] truncate">{profile?.department || "Official"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-copper/15 border border-copper/30 text-copper">
                    <span>👤</span>
                    <span>Citizen Contributor</span>
                  </span>
                )}

                {/* Primary Action Button */}
                {role === "government" ? (
                  <Link
                    href="/gov-dashboard"
                    className="text-xs font-bold px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-[#0D0D0C] transition-colors"
                  >
                    Ops Dashboard →
                  </Link>
                ) : (
                  <Link
                    href="/map?report=true"
                    onClick={handleReportClick}
                    className="text-xs font-bold px-3.5 py-2 rounded-lg bg-copper hover:bg-copper-light text-[#0D0D0C] transition-colors shadow-sm flex items-center gap-1"
                  >
                    <span>📢</span>
                    <span>Report Issue</span>
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-xs text-text-subtle hover:text-text-muted transition-colors px-2 py-1.5"
                  title="Sign out"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-white/[0.04] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-[56px] inset-x-0 z-40 border-b border-white/[0.05] px-4 py-4 md:hidden"
            style={{ background: "rgba(18,17,16,0.96)", backdropFilter: "blur(24px)" }}
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-3.5 py-2.5 rounded-md text-sm transition-colors",
                        active
                          ? "text-copper bg-copper/[0.08] border border-copper/[0.14] font-medium"
                          : "text-text-muted hover:text-text-primary hover:bg-white/[0.03]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="pt-3 mt-2 border-t border-white/[0.06]">
                {!loading && !user && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      className="block text-center py-2.5 text-sm text-text-muted hover:text-text-primary hover:bg-white/[0.03] rounded-md transition-colors"
                    >
                      Citizen Sign In
                    </Link>
                    <Link
                      href="/gov-login"
                      className="block text-center py-2.5 text-sm font-semibold rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 transition-colors"
                    >
                      🛡️ Government Official Portal
                    </Link>
                    <Link
                      href="/signup"
                      className="block text-center py-2.5 text-sm font-bold rounded-lg bg-copper text-[#0D0D0C] hover:bg-copper-light transition-colors"
                    >
                      Join Citizen Watch
                    </Link>
                  </div>
                )}

                {!loading && user && (
                  <div className="flex flex-col gap-2">
                    {role === "government" ? (
                      <Link
                        href="/gov-dashboard"
                        className="block text-center py-2.5 text-sm font-bold rounded-lg bg-amber-400 text-[#0D0D0C] transition-colors"
                      >
                        🛡️ Government Ops Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/map?report=true"
                        onClick={handleReportClick}
                        className="block text-center py-2.5 text-sm font-bold rounded-lg bg-copper text-[#0D0D0C] hover:bg-copper-light transition-colors"
                      >
                        📢 Report an Issue
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center py-2 text-sm text-text-subtle hover:text-text-muted rounded-md transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
