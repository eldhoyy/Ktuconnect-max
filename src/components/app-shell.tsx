"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Command, Menu, Search, X } from "lucide-react";
import { HomeIcon, LearnIcon, PlanIcon } from "@/components/icons/section-icons";
import topics from "@/data/important-topics.json";
import timetable from "@/data/november-2026-timetables.json";
import { ThemeInitializer, ThemeToggle } from "@/components/ui";
import { MotionPreferenceProvider, useMotionPreference } from "@/components/motion-preferences";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/notes", label: "Learn", icon: LearnIcon },
  { href: "/study-plan", label: "Plan", icon: PlanIcon },
  { href: "/about", label: "About", icon: HomeIcon },
];

function NavigationContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const { reduceMotion } = useMotionPreference();

  const searchItems = useMemo(() => {
    const subjectItems = timetable.exams.map((exam) => ({
      href: `/subjects/${encodeURIComponent(exam.code)}`,
      label: exam.title,
      detail: exam.code,
      kind: "Subject",
    }));
    const topicItems = Object.entries(topics).map(([code, item]) => ({
      href: `/subjects/${encodeURIComponent(code)}`,
      label: item.subject,
      detail: code,
      kind: "Topic guide",
    }));
    return [
      ...subjectItems,
      ...topicItems,
      { href: "/notes", label: "Browse notes", detail: "Learning resources", kind: "Page" },
      { href: "/pyq", label: "Previous question papers", detail: "Past papers", kind: "Page" },
      { href: "/syllabus", label: "Syllabus", detail: "Modules and curriculum", kind: "Page" },
      { href: "/updates", label: "KTU updates", detail: "Notices and announcements", kind: "Page" },
      { href: "/study-plan", label: "Study plan", detail: "Plan revision sessions", kind: "Page" },
      { href: "/timetable", label: "Exam timetable", detail: "Approved timetable records", kind: "Page" },
      { href: "/sources", label: "Sources and verification", detail: "Data policy", kind: "Page" },
    ].filter((item, index, all) => all.findIndex((candidate) => candidate.href === item.href && candidate.label === item.label) === index);
  }, []);

  const filteredItems = searchItems.filter((item) => `${item.label} ${item.detail} ${item.kind}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 9);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        setMenuOpen(false);
      }
      if (event.key === "Escape") {
        setOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, menuOpen]);

  return (
    <>
      <ThemeInitializer />
      <header className={compact ? "topbar is-compact" : "topbar"}>
        <Link href="/" className="brand" aria-label="Cohertx home">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 5h9v9H5zM18 5h9v22h-9zM5 18h9v9H5z" fill="currentColor"/><path d="M9 9h1v1H9zM22 9h1v14h-1zM9 22h1v1H9z" fill="var(--canvas)"/></svg></span>
          <span>cohertx<span className="brand-period">.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(({ href, label }) => (
            <Link href={href} key={href} className={pathname === href || (href !== "/" && pathname.startsWith(href)) ? "is-active" : ""}>
              {label}
              {(pathname === href || (href !== "/" && pathname.startsWith(href))) && <motion.span className="nav-active-pill" layoutId="nav-pill" transition={{ duration: reduceMotion ? 0 : 0.22 }} />}
            </Link>
          ))}
        </nav>
        <div className="topbar-actions">
          <ThemeToggle />
          <button className="search-trigger" onClick={() => setOpen(true)} aria-label="Open command palette"><Search size={17}/><span>Search</span><kbd>Ctrl / ⌘ K</kbd></button>
          <button className="mobile-menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu"><Menu size={20}/></button>
        </div>
      </header>
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {links.slice(0, 3).map(({ href, label, icon: Icon }) => <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}><Icon width={19} height={19}/><span>{label}</span></Link>)}
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div className="mobile-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
            <motion.section className="mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Site navigation" initial={reduceMotion ? false : { y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mobile-menu-heading"><span className="section-overline">NAVIGATE COHERTX</span><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu"><X size={22}/></button></div>
              <nav>{links.map(({ href, label }, index) => <Link href={href} key={href}><span>0{index + 1}</span>{label}<b>↗</b></Link>)}</nav>
              <Link href="/sources" className="mobile-menu-source">Sources & verification <span>↗</span></Link>
              <p>Learn it. Plan it. Track it.</p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.16 }}>
            <motion.section className="command-dialog" role="dialog" aria-modal="true" aria-label="Search Cohertx" initial={reduceMotion ? false : { opacity: 0, y: -8, scale: 0.99 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: reduceMotion ? 0 : 0.18 }}>
              <div className="command-input"><Search size={18}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects and pages…" /><button onClick={() => setOpen(false)} aria-label="Close search"><X size={18}/></button></div>
              <div className="command-results">
                {filteredItems.map((item) => <Link href={item.href} key={`${item.kind}-${item.href}-${item.label}`} onClick={() => { setOpen(false); setQuery(""); }}><span><small>{item.kind}</small><strong>{item.label}</strong><small>{item.detail}</small></span><span>↗</span></Link>)}
                {filteredItems.length === 0 && <p className="command-empty">No matching subjects or pages in the current index.</p>}
              </div>
              <div className="command-resource-note"><strong>Notes and paper search</strong><span>Resource search arrives in Stage 3. This palette currently searches the imported subject index and site pages.</span></div>
              <p className="command-hint"><Command size={12}/> Ctrl / Cmd + K to search · ESC to close</p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MotionPreferenceProvider><NavigationContent>{children}</NavigationContent></MotionPreferenceProvider>;
}
