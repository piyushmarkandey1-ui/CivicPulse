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

// ─── Dual Portal Direct 1-Click Access Buttons ───────────────────────────────
export function DualPortalAuthDropdowns() {
  const router = useRouter();
  const { role, loginAsCitizen, loginAsOfficer } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {/* ─── OPTION 1: FOR CITIZENS ─── */}
      <button
        type="button"
        onClick={() => {
          loginAsCitizen();
          router.push("/map");
        }}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none border shadow-xs cursor-pointer",
          role === "citizen"
            ? "bg-[#8B2635] text-white border-[#8B2635]"
            : "bg-white/90 text-[#242222] border-[#DED8CD] hover:border-[#8B2635] hover:text-[#8B2635] hover:bg-[#FAF3EF]"
        )}
        title="1-Click Instant Citizen Entry"
      >
        <span>👤</span>
        <span>Citizen Portal</span>
      </button>

      {/* ─── OPTION 2: FOR OFFICERS ─── */}
      <button
        type="button"
        onClick={() => {
          loginAsOfficer();
          router.push("/gov-dashboard");
        }}
        className={cn(
          "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 select-none border shadow-xs cursor-pointer",
          role === "government"
            ? "bg-[#242222] text-[#F7F4ED] border-[#242222]"
            : "bg-[#F0E5D8] text-[#8B2635] border-[#D6C2A3] hover:border-[#8B2635] hover:bg-[#EBDDCB]"
        )}
        title="1-Click Instant Officer Entry"
      >
        <span>🛡️</span>
        <span>Officer Portal</span>
      </button>
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
  const { user, role, profile, loading, signOut, loginAsCitizen, loginAsOfficer } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

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

  // Hide global Navbar on gov-dashboard — it has its own sidebar navigation
  const isGovDashboard = pathname?.startsWith("/gov-dashboard");

  const navLinks = [{ label: "Home", href: "/" }];
  if (role === "citizen") {
    navLinks.push({ label: "Live Map", href: "/map" });
    navLinks.push({ label: "My Reports", href: "/profile" });
  } else if (!user) {
    navLinks.push({ label: "Live Map Radar", href: "/map" });
  }

  if (isGovDashboard) return null;

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
          <div className="hidden md:flex flex-shrink-0 items-center gap-2">
            {!loading && !user && <DualPortalAuthDropdowns />}

            {!loading && user && (
              <div className="flex items-center gap-2">
                {/* Mode Pill Indicator */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs",
                    role === "government"
                      ? "bg-[#242222] text-[#F7F4ED] border-[#242222]"
                      : "bg-[#FAF3EF] text-[#8B2635] border-[#EAD6CE]"
                  )}
                >
                  <span>{role === "government" ? "🛡️ Officer Mode" : "👤 Citizen Mode"}</span>
                </span>

                {/* Instant 1-Click Role Switcher */}
                {role === "citizen" ? (
                  <button
                    type="button"
                    onClick={() => {
                      loginAsOfficer();
                      router.push("/gov-dashboard");
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#242222] hover:bg-[#181616] text-[#F7F4ED] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Switch to Municipal Officer Command Portal"
                  >
                    <span>🛡️</span>
                    <span>Officer Portal →</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      loginAsCitizen();
                      router.push("/map");
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#8B2635] hover:bg-[#641B27] text-white transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                    title="Switch to Citizen Live Map"
                  >
                    <span>👤</span>
                    <span>Citizen Portal →</span>
                  </button>
                )}

                {/* Primary Action Button */}
                {role === "citizen" && (
                  <Link
                    href="/map?report=true"
                    onClick={handleReportClick}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-[#DED8CD] hover:border-[#8B2635] text-[#8B2635] transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <span>📢</span>
                    <span>Report</span>
                  </Link>
                )}
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
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      loginAsCitizen();
                      setMobileOpen(false);
                      router.push("/map");
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer",
                      role === "citizen"
                        ? "bg-[#8B2635] text-white"
                        : "bg-[#FAF3EF] text-[#8B2635] border border-[#E8D4CD]"
                    )}
                  >
                    <span>👤</span>
                    <span>Enter as Citizen (Live Map &amp; Reports)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      loginAsOfficer();
                      setMobileOpen(false);
                      router.push("/gov-dashboard");
                    }}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer",
                      role === "government"
                        ? "bg-[#242222] text-[#F7F4ED]"
                        : "bg-[#F0E5D8] text-[#8B2635] border border-[#D6C2A3]"
                    )}
                  >
                    <span>🛡️</span>
                    <span>Enter as Municipal Officer</span>
                  </button>
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
