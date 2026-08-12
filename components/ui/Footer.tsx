"use client";

import Link from "next/link";
import { Divider } from "@/components/ui/Divider";

const footerLinks = {
  Platform: [
    { label: "Live Map",          href: "/map" },
    { label: "Gov Dashboard",     href: "/gov-dashboard" },
    { label: "Citizen Profile",   href: "/profile" },
    { label: "Ward Leaderboard",  href: "/gov-dashboard" },
  ],
  Company: [
    { label: "About",     href: "#" },
    { label: "Blog",      href: "#" },
    { label: "Press",     href: "#" },
    { label: "Contact",   href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy",  href: "#" },
    { label: "Terms of Use",    href: "#" },
    { label: "Open Data Policy",href: "#" },
  ],
};

function TwitterIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const socialLinks = [
  { label: "Twitter / X", href: "#", icon: <TwitterIcon /> },
  { label: "GitHub",      href: "#", icon: <GithubIcon /> },
  { label: "LinkedIn",    href: "#", icon: <LinkedinIcon /> },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-white/[0.06] bg-navy-light/60 backdrop-blur-md">
      {/* Teal accent top line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-teal/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group" aria-label="CivicPulse home">
              <span className="text-teal">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="10" r="3" fill="currentColor" />
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z" fill="currentColor" fillOpacity={0.2} stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span className="font-bold text-lg tracking-tight">
                <span className="text-white">Civic</span>
                <span className="gradient-text">Pulse</span>
              </span>
            </Link>
            <p className="text-body-sm text-slate-400 max-w-xs leading-relaxed">
              Empowering communities through transparent civic data, real-time issue tracking, and collaborative governance.
            </p>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="p-2 rounded-lg text-slate-500 hover:text-teal hover:bg-teal/10 transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-caption text-slate-500">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-slate-400 hover:text-teal transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-caption text-slate-600">
          <span>© {year} CivicPulse. All rights reserved.</span>
          <span className="flex items-center gap-1.5">
            Built with
            <span className="text-red-400">♥</span>
            for accountable cities
          </span>
        </div>
      </div>
    </footer>
  );
}
