"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Command, Menu, Search, X, House, BookOpen, CalendarDays, ChartNoAxesColumnIncreasing, Sun, Moon } from "lucide-react";
import topics from "@/data/important-topics.json";
import timetable from "@/data/november-2026-timetables.json";
import { ThemeInitializer } from "@/components/ui";
import { MotionPreferenceProvider, useMotionPreference } from "@/components/motion-preferences";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";

function keepFocusInside(event: ReactKeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;
  const elements = event.currentTarget.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex='-1'])");
  if (!elements.length) return;
  const first = elements[0];
  const last = elements[elements.length - 1];
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
}

const desktopLinks = [
  { href: "/notes", label: "Learn" },
  { href: "/study-plan", label: "Plan" },
  { href: "/progress", label: "Track" },
];
const mobileLinks = [
  { href: "/", label: "Home", Icon: House },
  { href: "/notes", label: "Learn", Icon: BookOpen },
  { href: "/study-plan", label: "Plan", Icon: CalendarDays },
  { href: "/progress", label: "Progress", Icon: ChartNoAxesColumnIncreasing },
];

function BrandMark() {
  return <svg viewBox="0 0 36 36" role="img" aria-label="Datum mark" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square">
    <path d="M5 18h26M5 13v10M31 13v10M11 9l7-4 7 4M18 5v26" />
    <circle cx="18" cy="18" r="2.2" fill="currentColor" stroke="none" />
  </svg>;
}

function NavigationContent({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);
  const { reduceMotion, toggle } = useMotionPreference();

  const searchItems = useMemo(() => {
    const subjectItems = timetable.exams.map((exam) => ({
      href: `/subjects/${encodeURIComponent(exam.code)}`, label: exam.title, detail: exam.code, kind: "Subject",
    }));
    const topicItems = Object.entries(topics).map(([code, item]) => ({
      href: `/subjects/${encodeURIComponent(code)}`, label: item.subject, detail: code, kind: "Topic guide",
    }));
    return [
      ...subjectItems, ...topicItems,
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
        event.preventDefault(); setOpen((value) => !value); setMenuOpen(false);
      }
      if (event.key === "Escape") { setOpen(false); setMenuOpen(false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 12);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open || menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, menuOpen]);
  useEffect(() => { setDark(document.documentElement.dataset.theme === "dark"); }, []);

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("datum-theme", next);
    setDark(next === "dark");
  }

  return (
    <>
      <ThemeInitializer />
      <header className={compact ? "topbar is-compact" : "topbar"}>
        <Link href="/" className="brand" aria-label="Datum home">
          <span className="brand-mark"><BrandMark /></span><span>datum<span className="brand-period">.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {desktopLinks.map(({ href, label }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(href));
            return <Link href={href} key={href} className={active ? "is-active" : ""}>{label}{active && <motion.span className="nav-active-pill" layoutId="datum-nav-pill" transition={{ duration: reduceMotion ? 0 : .2 }} />}</Link>;
          })}
        </nav>
        <div className="topbar-actions">
          <button className="theme-trigger" type="button" onClick={toggleTheme} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>{dark ? <Sun size={18} strokeWidth={1.8}/> : <Moon size={18} strokeWidth={1.8}/>}</button>
          <button className="search-trigger" onClick={() => setOpen(true)} aria-label="Open command palette"><Search size={17} strokeWidth={1.8}/><span>Search</span><kbd>⌘ K</kbd></button>
          <button className="mobile-menu-trigger" type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu"><Menu size={20} strokeWidth={1.8}/></button>
        </div>
      </header>
      <PageTransition>{children}</PageTransition>
      <SiteFooter />
      <nav className="mobile-tabs" aria-label="Mobile navigation">
        {mobileLinks.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return <Link href={href} key={href} aria-current={active ? "page" : undefined} className={active ? "is-active" : ""}><Icon size={19} strokeWidth={1.8}/><span>{label}</span></Link>;
        })}
        <button type="button" className="mobile-more" onClick={() => setMenuOpen(true)} aria-label="Open more navigation"><Menu size={19}/></button>
      </nav>

      <AnimatePresence>
        {menuOpen && <motion.div className="mobile-menu-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section className="mobile-menu-sheet" role="dialog" aria-modal="true" aria-label="Site navigation" onKeyDown={keepFocusInside}
            initial={reduceMotion ? false : { y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ duration: reduceMotion ? 0 : .28, ease: [0.22, 1, .36, 1] }}>
            <div className="mobile-menu-heading"><Link href="/" className="brand"><span className="brand-mark"><BrandMark/></span><span>datum.</span></Link><button type="button" onClick={() => setMenuOpen(false)} aria-label="Close navigation menu"><X size={22}/></button></div>
            <nav>{[...desktopLinks, { href: "/timetable", label: "Timetable" }, { href: "/about", label: "About" }, { href: "/sources", label: "Sources" }].map(({ href, label }, index) => <Link href={href} key={href}><span>{String(index + 1).padStart(2, "0")}</span>{label}<b>↗</b></Link>)}</nav>
            <button type="button" className="motion-toggle" onClick={toggle}><span>Reduce motion</span><strong>{reduceMotion ? "On" : "Off"}</strong></button>
          </motion.section>
        </motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {open && <motion.div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.section className="command-dialog" role="dialog" aria-modal="true" aria-label="Search Datum" onKeyDown={keepFocusInside}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
            <div className="command-input"><Search size={18}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects and pages…"/><button onClick={() => setOpen(false)} aria-label="Close search"><X size={18}/></button></div>
            <div className="command-results">
              {filteredItems.map((item) => <Link href={item.href} key={`${item.kind}-${item.href}-${item.label}`} onClick={() => { setOpen(false); setQuery(""); }}><span><small>{item.kind}</small><strong>{item.label}</strong><small>{item.detail}</small></span><span>↗</span></Link>)}
              {filteredItems.length === 0 && <p className="command-empty">No matching subjects or pages in the current index.</p>}
            </div>
            <div className="command-resource-note"><strong>Resource search</strong><span>Notes and paper search will be connected in Stage 3.</span></div>
            <p className="command-hint"><Command size={12}/> Ctrl / Cmd + K to search · Esc to close</p>
          </motion.section>
        </motion.div>}
      </AnimatePresence>
    </>
  );
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return <MotionPreferenceProvider><NavigationContent>{children}</NavigationContent></MotionPreferenceProvider>;
}
