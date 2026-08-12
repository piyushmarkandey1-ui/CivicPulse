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

function MapPinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="10" r="3" fill="currentColor" />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        fill="currentColor"
        fillOpacity={0.2}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-5 h-4 flex flex-col justify-between" aria-hidden>
      <span
        className={cn(
          "block h-0.5 rounded-full bg-slate-200 transition-all duration-300 origin-center",
          open && "rotate-45 translate-y-[7px]"
        )}
      />
      <span
        className={cn(
          "block h-0.5 rounded-full bg-slate-200 transition-all duration-300",
          open && "opacity-0 scale-x-0"
        )}
      />
      <span
        className={cn(
          "block h-0.5 rounded-full bg-slate-200 transition-all duration-300 origin-center",
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
  const { user, role, loading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  // Determine which links to show
  const navLinks = [{ label: "Home", href: "/" }];
  
  if (role === "government") {
    navLinks.push({ label: "Dashboard", href: "/gov-dashboard" });
  } else if (role === "citizen") {
    navLinks.push({ label: "Live Map", href: "/map" });
    navLinks.push({ label: "My Profile", href: "/profile" });
  } else if (!user) {
    navLinks.push({ label: "Live Map", href: "/map" }); // Public map
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-500",
          scrolled
            ? "glass border-b border-white/[0.06] py-3"
            : "bg-transparent py-5"
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group" aria-label="CivicPulse home">
            <span className="text-teal group-hover:scale-110 transition-transform duration-200">
              <MapPinIcon />
            </span>
            <span className="font-bold text-lg tracking-tight">
              <span className="text-white">Civic</span>
              <span className="gradient-text">Pulse</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <ul className="hidden md:flex items-center gap-1" role="navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                      active
                        ? "text-teal"
                        : "text-slate-400 hover:text-slate-100"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active-pill"
                        className="absolute inset-0 rounded-lg bg-teal/10 border border-teal/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* ── Desktop CTA / Auth ── */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-4">
            {!loading && !user && (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
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
                    Report an Issue
                  </GradientButton>
                )}
                <button onClick={handleLogout} className="text-sm font-medium text-slate-400 hover:text-red-400 transition-colors">
                  Logout
                </button>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </header>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed top-[60px] inset-x-0 z-40 glass border-b border-white/[0.06] px-4 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        active
                          ? "text-teal bg-teal/10 border border-teal/20"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              
              <li className="pt-4 mt-2 border-t border-white/10">
                {!loading && !user && (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" className="block text-center py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                      Sign In
                    </Link>
                    <GradientButton href="/signup" size="sm" className="w-full justify-center">
                      Sign Up
                    </GradientButton>
                  </div>
                )}
                {!loading && user && (
                  <div className="flex flex-col gap-2">
                    {role === "citizen" && (
                      <GradientButton href="/map" size="sm" className="w-full justify-center">
                        Report an Issue
                      </GradientButton>
                    )}
                    <button onClick={handleLogout} className="block text-center py-2.5 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors">
                      Logout
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
