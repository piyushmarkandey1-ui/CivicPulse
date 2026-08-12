"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="10" r="2.5" fill="#4FD1A5" />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        fill="rgba(79,209,165,0.15)"
        stroke="#4FD1A5"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-4 h-3.5 flex flex-col justify-between" aria-hidden>
      <span className={cn("block h-px rounded-full bg-slate-400 transition-all duration-300 origin-center", open && "rotate-45 translate-y-[7px]")} />
      <span className={cn("block h-px rounded-full bg-slate-400 transition-all duration-300", open && "opacity-0 scale-x-0")} />
      <span className={cn("block h-px rounded-full bg-slate-400 transition-all duration-300 origin-center", open && "-rotate-45 -translate-y-[7px]")} />
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
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const navLinks = [{ label: "Home", href: "/" }];
  if (role === "government") navLinks.push({ label: "Dashboard", href: "/gov-dashboard" });
  else if (role === "citizen") {
    navLinks.push({ label: "Live Map", href: "/map" });
    navLinks.push({ label: "Profile", href: "/profile" });
  } else if (!user) {
    navLinks.push({ label: "Live Map", href: "/map" });
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-400",
          scrolled
            ? "border-b border-white/[0.05] py-3"
            : "bg-transparent py-4"
        )}
        style={
          scrolled
            ? { background: "rgba(7,11,20,0.88)", backdropFilter: "blur(24px)" }
            : undefined
        }
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group" aria-label="CivicPulse home">
            <LogoIcon />
            <span className="font-semibold text-[15px] tracking-tight">
              <span className="text-slate-100">Civic</span>
              <span className="text-teal">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-0.5" role="navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-2 rounded-md text-sm transition-colors duration-200",
                      active
                        ? "text-teal"
                        : "text-slate-400 hover:text-slate-100"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 rounded-md bg-teal/[0.07] border border-teal/[0.15]"
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
                  className="text-sm text-slate-400 hover:text-slate-100 transition-colors px-3 py-2"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold px-4 py-2 rounded-lg bg-teal text-[#070B14] hover:bg-teal-light transition-colors duration-200"
                >
                  Get Started
                </Link>
              </>
            )}
            {!loading && user && (
              <>
                {role === "citizen" && (
                  <Link
                    href="/map"
                    className="text-sm font-semibold px-4 py-2 rounded-lg bg-teal text-[#070B14] hover:bg-teal-light transition-colors duration-200"
                  >
                    Report Issue
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-slate-300 transition-colors px-3 py-2"
                >
                  Sign out
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md hover:bg-white/[0.04] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle mobile menu"
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
            style={{ background: "rgba(7,11,20,0.95)", backdropFilter: "blur(24px)" }}
          >
            <ul className="flex flex-col gap-0.5">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-3.5 py-2.5 rounded-md text-sm transition-colors",
                        active
                          ? "text-teal bg-teal/[0.07] border border-teal/[0.12]"
                          : "text-slate-400 hover:text-slate-100 hover:bg-white/[0.03]"
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
                    <Link href="/login" className="block text-center py-2.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-white/[0.03] rounded-md transition-colors">
                      Sign in
                    </Link>
                    <Link href="/signup" className="block text-center py-2.5 text-sm font-semibold rounded-lg bg-teal text-[#070B14] hover:bg-teal-light transition-colors">
                      Get Started
                    </Link>
                  </div>
                )}
                {!loading && user && (
                  <div className="flex flex-col gap-2">
                    {role === "citizen" && (
                      <Link href="/map" className="block text-center py-2.5 text-sm font-semibold rounded-lg bg-teal text-[#070B14] hover:bg-teal-light transition-colors">
                        Report Issue
                      </Link>
                    )}
                    <button onClick={handleLogout} className="block w-full text-center py-2.5 text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] rounded-md transition-colors">
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
