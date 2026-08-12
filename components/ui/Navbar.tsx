"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { GradientButton } from "@/components/ui/GradientButton";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

/* ── Icons ── */
function MapPinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        fill="currentColor"
        fillOpacity={0.18}
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="9.5" r="2.5" fill="currentColor" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-5 h-[14px] flex flex-col justify-between" aria-hidden>
      <span
        className={cn(
          "block h-0.5 rounded-full bg-gray-mid transition-all duration-200 origin-center",
          open && "rotate-45 translate-y-[6px]"
        )}
      />
      <span
        className={cn(
          "block h-0.5 rounded-full bg-gray-mid transition-all duration-200",
          open && "opacity-0 scale-x-0"
        )}
      />
      <span
        className={cn(
          "block h-0.5 rounded-full bg-gray-mid transition-all duration-200 origin-center",
          open && "-rotate-45 -translate-y-[6px]"
        )}
      />
    </div>
  );
}

/* ── Desktop nav link ── */
function NavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
        active
          ? "text-blue"
          : "text-gray-mid hover:text-gray-dark"
      )}
    >
      {label}
      {active && (
        <span className="absolute inset-0 rounded-lg bg-blue-muted border border-blue/15" />
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname     = usePathname();
  const router       = useRouter();
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // Build nav links based on role
  const navLinks = [{ label: "Home", href: "/" }];
  if (role === "government") {
    navLinks.push({ label: "Dashboard", href: "/gov-dashboard" });
  } else if (role === "citizen") {
    navLinks.push({ label: "Live Map",  href: "/map"     });
    navLinks.push({ label: "Profile",   href: "/profile" });
  } else if (!user) {
    navLinks.push({ label: "Live Map",  href: "/map"     });
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-400",
          scrolled
            ? "glass-light border-b border-gray-border py-3 shadow-nav"
            : "bg-transparent py-5"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group"
            aria-label="CivicPulse home"
          >
            <span className="text-blue">
              <MapPinIcon />
            </span>
            <span className="font-bold text-[1.0625rem] tracking-tight leading-none">
              <span className="text-gray-dark">Civic</span>
              <span className="gradient-text">Pulse</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-0.5 flex-1 justify-center" role="navigation">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} active={pathname === link.href} />
              </li>
            ))}
          </ul>

          {/* ── Desktop Auth / CTA ── */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-3">
            {!loading && !user && (
              <>
                {/* Sign In — secondary outline-style link */}
                <Link
                  href="/login"
                  className={cn(
                    "relative px-4 py-2 rounded-md text-sm font-semibold border transition-all duration-200",
                    "border-gray-border text-gray-mid hover:text-gray-dark hover:border-gray-mid hover:bg-gray-muted/50"
                  )}
                >
                  Sign In
                </Link>
                <GradientButton href="/signup" size="sm">
                  Sign Up
                </GradientButton>
              </>
            )}
            {!loading && user && (
              <>
                {role === "citizen" && (
                  <GradientButton href="/map" size="sm">
                    Report Issue
                  </GradientButton>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-mid hover:text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/20 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            className="md:hidden p-2.5 rounded-md hover:bg-gray-muted border border-transparent hover:border-gray-border transition-all duration-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-gray-dark/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0  }}
              exit={{ opacity: 0, y: -6  }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[60px] inset-x-0 z-50 glass-light border-b border-gray-border px-4 py-5 md:hidden"
            >
              {/* Nav links */}
              <ul className="flex flex-col gap-1 mb-4">
                {navLinks.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                          active
                            ? "text-blue bg-blue-muted border border-blue/15"
                            : "text-gray-mid hover:text-gray-dark hover:bg-gray-muted/50"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {/* Auth actions */}
              <div className="border-t border-gray-border pt-4 flex flex-col gap-2">
                {!loading && !user && (
                  <>
                    <Link
                      href="/login"
                      className="block text-center py-2.5 px-4 text-sm font-semibold text-gray-mid hover:text-gray-dark hover:bg-gray-muted/50 rounded-md border border-gray-border transition-all duration-200"
                    >
                      Sign In
                    </Link>
                    <GradientButton href="/signup" size="sm" className="w-full justify-center">
                      Sign Up Free
                    </GradientButton>
                  </>
                )}
                {!loading && user && (
                  <>
                    {role === "citizen" && (
                      <GradientButton href="/map" size="sm" className="w-full justify-center">
                        Report Issue
                      </GradientButton>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/[0.08] rounded-xl border border-red-500/20 transition-all duration-200"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
