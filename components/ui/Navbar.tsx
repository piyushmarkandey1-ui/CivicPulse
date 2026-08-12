"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="10" r="2.5" fill="#8B2635" />
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
        fill="rgba(139, 38, 53, 0.15)"
        stroke="#8B2635"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative w-4 h-3.5 flex flex-col justify-between" aria-hidden>
      <span
        className={cn(
          "block h-0.5 rounded-full bg-[#242222] transition-all duration-300 origin-center",
          open && "rotate-45 translate-y-[6px]"
        )}
      />
      <span
        className={cn(
          "block h-0.5 rounded-full bg-[#242222] transition-all duration-300",
          open && "opacity-0 scale-x-0"
        )}
      />
      <span
        className={cn(
          "block h-0.5 rounded-full bg-[#242222] transition-all duration-300 origin-center",
          open && "-rotate-45 -translate-y-[6px]"
        )}
      />
    </div>
  );
}

// ─── Dual Portal Auth Dropdowns (Floating Pill Style) ─────────────────────────
export function DualPortalAuthDropdowns() {
  const [openDropdown, setOpenDropdown] = useState<"citizen" | "officer" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="flex items-center gap-2">
      {/* ─── OPTION 1: FOR CITIZENS ─── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown((cur) => (cur === "citizen" ? null : "citizen"))}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 select-none border shadow-xs",
            openDropdown === "citizen"
              ? "bg-[#8B2635] text-white border-[#8B2635]"
              : "bg-white/80 backdrop-blur-sm text-[#242222] border-[#DED8CD] hover:border-[#8B2635] hover:text-[#8B2635] hover:bg-white"
          )}
          aria-expanded={openDropdown === "citizen"}
        >
          <span>👤</span>
          <span>For Citizens</span>
          <motion.svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: openDropdown === "citizen" ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {openDropdown === "citizen" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-56 p-1.5 rounded-2xl border border-[#DED8CD]/80 shadow-[0_12px_36px_rgba(36,34,34,0.12)] z-50 bg-white/95 backdrop-blur-md"
            >
              <div className="px-3 py-2 border-b border-[#DED8CD]/60 mb-1">
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#8B2635]">
                  Citizen Portal
                </p>
                <p className="text-[11px] text-[#625E59]">Report & track municipal issues</p>
              </div>

              <Link
                href="/login"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#242222] hover:bg-[#F0E5D8] hover:text-[#8B2635] transition-colors"
              >
                <span className="text-sm">🔑</span>
                <div>
                  <div className="font-bold">Citizen Sign In</div>
                  <div className="text-[10px] text-[#88827A] font-normal">Access your reports</div>
                </div>
              </Link>

              <Link
                href="/signup"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#242222] hover:bg-[#F0E5D8] hover:text-[#8B2635] transition-colors mt-0.5"
              >
                <span className="text-sm">📝</span>
                <div>
                  <div className="font-bold">Citizen Sign Up</div>
                  <div className="text-[10px] text-[#88827A] font-normal">Join citizen watch</div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── OPTION 2: FOR OFFICERS ─── */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenDropdown((cur) => (cur === "officer" ? null : "officer"))}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 select-none border shadow-xs",
            openDropdown === "officer"
              ? "bg-[#242222] text-[#F7F4ED] border-[#242222]"
              : "bg-[#F0E5D8]/80 backdrop-blur-sm text-[#8B2635] border-[#D6C2A3] hover:border-[#8B2635] hover:bg-[#EBDDCB]"
          )}
          aria-expanded={openDropdown === "officer"}
        >
          <span>🛡️</span>
          <span>For Officers</span>
          <motion.svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ rotate: openDropdown === "officer" ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path d="M6 9l6 6 6-6" />
          </motion.svg>
        </button>

        <AnimatePresence>
          {openDropdown === "officer" && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.97 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-60 p-1.5 rounded-2xl border border-[#D6C2A3]/80 shadow-[0_12px_36px_rgba(36,34,34,0.12)] z-50 bg-white/95 backdrop-blur-md"
            >
              <div className="px-3 py-2 border-b border-[#DED8CD]/60 mb-1">
                <p className="text-[10px] font-bold tracking-wider uppercase text-[#8B2635]">
                  Government Portal
                </p>
                <p className="text-[11px] text-[#625E59]">Municipal Command & Ward Triage</p>
              </div>

              <Link
                href="/gov-login"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#242222] hover:bg-[#F0E5D8] hover:text-[#8B2635] transition-colors"
              >
                <span className="text-sm">🛡️</span>
                <div>
                  <div className="font-bold">Official Sign In</div>
                  <div className="text-[10px] text-[#88827A] font-normal">Authorized personnel only</div>
                </div>
              </Link>

              <Link
                href="/gov-signup"
                onClick={() => setOpenDropdown(null)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#242222] hover:bg-[#F0E5D8] hover:text-[#8B2635] transition-colors mt-0.5"
              >
                <span className="text-sm">📋</span>
                <div>
                  <div className="font-bold">Officer Registration</div>
                  <div className="text-[10px] text-[#88827A] font-normal">Department invite code required</div>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCitizenOpen, setMobileCitizenOpen] = useState(false);
  const [mobileOfficerOpen, setMobileOfficerOpen] = useState(false);
  const { user, role, profile, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
    navLinks.push({ label: "Live Map Radar", href: "/map" });
  }

  return (
    <>
      {/* Completely Transparent Full-Width Header Wrapper with Floating Capsule Inside */}
      <header className="fixed top-2.5 inset-x-0 z-50 flex justify-center px-3 sm:px-6 lg:px-8 pointer-events-none transition-all duration-300">
        <nav
          className={cn(
            "w-full max-w-7xl flex items-center justify-between gap-4 px-5 py-2 rounded-full pointer-events-auto transition-all duration-300",
            scrolled
              ? "bg-white/80 backdrop-blur-md border border-[#DED8CD]/60 shadow-[0_8px_24px_rgba(36,34,34,0.05),0_1px_2px_rgba(36,34,34,0.02)]"
              : "bg-transparent border border-transparent"
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 flex-shrink-0 group"
            aria-label="CivicPulse home"
          >
            <LogoIcon />
            <span className="font-bold text-base tracking-tight text-[#242222]">
              <span>Civic</span>
              <span className="text-[#8B2635]">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Clean, Floating Text with Subtle Indicator) */}
          <ul className="hidden md:flex items-center gap-1" role="navigation">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-3.5 py-1 text-sm font-medium transition-colors duration-200",
                      active
                        ? "text-[#8B2635] font-bold"
                        : "text-[#625E59] hover:text-[#8B2635]"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="absolute bottom-0 inset-x-3 h-0.5 bg-[#8B2635] rounded-full"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex flex-shrink-0 items-center gap-3">
            {!loading && !user && <DualPortalAuthDropdowns />}

            {!loading && user && (
              <div className="flex items-center gap-3">
                {/* Role Badge Indicator */}
                {role === "government" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0E5D8] border border-[#D6C2A3] text-[#8B2635] shadow-xs">
                    <span>🛡️</span>
                    <span className="max-w-[140px] truncate">{profile?.department || "Official"}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#8B2635]/10 border border-[#8B2635]/20 text-[#8B2635]">
                    <span>👤</span>
                    <span>Citizen</span>
                  </span>
                )}

                {/* Primary Action Button */}
                {role === "government" ? (
                  <Link
                    href="/gov-dashboard"
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#8B2635] hover:bg-[#641B27] text-white transition-colors shadow-xs"
                  >
                    Ops Dashboard →
                  </Link>
                ) : (
                  <Link
                    href="/map?report=true"
                    onClick={handleReportClick}
                    className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#8B2635] hover:bg-[#641B27] text-white transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>📢</span>
                    <span>Report Issue</span>
                  </Link>
                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-xs text-[#88827A] hover:text-[#242222] transition-colors px-2 py-1"
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
            className="md:hidden p-2 rounded-lg hover:bg-[#F0E5D8] transition-colors"
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
            className="fixed top-[60px] inset-x-4 z-50 rounded-2xl border border-[#DED8CD] p-4 md:hidden bg-white/95 backdrop-blur-md shadow-2xl"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-3.5 py-2.5 rounded-xl text-sm transition-colors",
                        active
                          ? "text-[#8B2635] bg-[#F0E5D8] font-bold"
                          : "text-[#625E59] hover:text-[#8B2635] hover:bg-[#F0E5D8]/50"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="pt-3 mt-2 border-t border-[#DED8CD] space-y-2">
                {!loading && !user && (
                  <div className="flex flex-col gap-2.5">
                    <div className="rounded-xl border border-[#DED8CD] bg-white overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setMobileCitizenOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#8B2635]"
                      >
                        <div className="flex items-center gap-2">
                          <span>👤</span>
                          <span>For Citizens</span>
                        </div>
                        <span>{mobileCitizenOpen ? "▲" : "▼"}</span>
                      </button>
                      {mobileCitizenOpen && (
                        <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-[#DED8CD]">
                          <Link
                            href="/login"
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#242222] bg-[#F7F4ED]"
                          >
                            🔑 Citizen Sign In
                          </Link>
                          <Link
                            href="/signup"
                            className="block px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#8B2635] text-center"
                          >
                            📝 Citizen Sign Up (Register)
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="rounded-xl border border-[#D6C2A3] bg-[#F0E5D8]/50 overflow-hidden shadow-xs">
                      <button
                        type="button"
                        onClick={() => setMobileOfficerOpen((v) => !v)}
                        className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#242222]"
                      >
                        <div className="flex items-center gap-2">
                          <span>🛡️</span>
                          <span>For Officers</span>
                        </div>
                        <span>{mobileOfficerOpen ? "▲" : "▼"}</span>
                      </button>
                      {mobileOfficerOpen && (
                        <div className="px-3 pb-3 pt-1 space-y-1.5 border-t border-[#D6C2A3]">
                          <Link
                            href="/gov-login"
                            className="block px-3 py-2 rounded-lg text-xs font-semibold text-[#242222] bg-white"
                          >
                            🛡️ Officer Sign In
                          </Link>
                          <Link
                            href="/gov-signup"
                            className="block px-3 py-2 rounded-lg text-xs font-bold text-white bg-[#242222] text-center"
                          >
                            📋 Officer Registration (Invite Code)
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!loading && user && (
                  <div className="flex flex-col gap-2">
                    {role === "government" ? (
                      <Link
                        href="/gov-dashboard"
                        className="block text-center py-2.5 text-sm font-bold rounded-lg bg-[#8B2635] text-white transition-colors"
                      >
                        🛡️ Government Ops Dashboard
                      </Link>
                    ) : (
                      <Link
                        href="/map?report=true"
                        onClick={handleReportClick}
                        className="block text-center py-2.5 text-sm font-bold rounded-lg bg-[#8B2635] text-white transition-colors"
                      >
                        📢 Report an Issue
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center py-2 text-sm text-[#88827A] hover:text-[#242222] rounded-lg transition-colors"
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
