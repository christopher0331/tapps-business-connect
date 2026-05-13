"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "RSVP", href: "/rsvp" },
  { label: "Apply", href: "/apply" },
];

const secondaryNav = [
  { label: "Member Directory", href: "/directory" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-500 ${
          mobileOpen
            ? "bg-transparent"
            : scrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex items-center justify-end h-20 lg:h-24">
            <nav className="hidden lg:flex items-center gap-8">
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] font-medium uppercase tracking-[0.15em] transition-colors duration-300 hover:opacity-60 ${
                    scrolled ? "text-charcoal" : "text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="https://www.onsiteregroup.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:opacity-80 ${
                  scrolled
                    ? "border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white hover:border-charcoal"
                    : "border-white/40 text-white hover:bg-white/10"
                }`}
              >
                OnSite ReGroup
              </Link>
            </nav>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden relative z-[80] w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-colors ${
                mobileOpen
                  ? "text-white"
                  : scrolled
                    ? "text-charcoal"
                    : "text-white"
              }`}
              aria-label="Toggle menu"
            >
              <motion.span
                animate={
                  mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
                className="block w-6 h-[1.5px] bg-current origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-[1.5px] bg-current"
              />
              <motion.span
                animate={
                  mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
                className="block w-6 h-[1.5px] bg-current origin-center"
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] bg-charcoal"
          >
            <motion.nav
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.3, delay: 0.18 }}
              className="flex flex-col items-center justify-center h-full gap-6"
            >
              {mainNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl text-white/90 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-12 h-px bg-white/20 my-2" />
              {secondaryNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="w-12 h-px bg-white/20 my-2" />
              <Link
                href="https://www.onsiteregroup.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-white/80 hover:text-white hover:border-white/70 transition-colors"
              >
                OnSite Real Estate Group
              </Link>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
