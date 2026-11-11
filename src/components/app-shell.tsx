"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookOpen, CalendarDays, Command, Home, Search, X, FileText, GraduationCap } from "lucide-react";
import topics from "@/data/important-topics.json";
import timetable from "@/data/november-2026-timetables.json";
import { ThemeToggle } from "@/components/ui";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notes", label: "Learn", icon: BookOpen },
  { href: "/study-plan", label: "Plan", icon: CalendarDays },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
    ].filter((item, index, all) => all.findIndex((candidate) => candidate.href === item.href && candidate.label === item.label) === index);
  }, []);

  const filteredItems = searchItems.filter((item) => `${item.label} ${item.detail} ${item.kind}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 9);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="topbar">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 5h9v9H5zM18 5h9v22h-9zM5 18h9v9H5z" fill="currentColor"/><path d="M9 9h1v1H9zM22 9h1v14h-1zM9 22h1v1H9z" fill="var(--canvas)"/></svg></span>
          <span>cohertx<span className="brand-period">.</span></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}</nav>
        <div className="topbar-actions">
          <ThemeToggle />
          <button className="search-trigger" onClick={() => setOpen(true)} aria-label="Search Cohertx"><Search size={17}/><span>Search</span><kbd>⌘ K</kbd></button>
        </div>
      </header>
      {children}
      <nav className="mobile-tabs" aria-label="Mobile navigation">{links.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={19}/><span>{label}</span></Link>)}</nav>
      {open && <div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Search Cohertx">
          <div className="command-input"><Search size={18}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects, notes, papers and pages…" /><button onClick={() => setOpen(false)} aria-label="Close search"><X size={18}/></button></div>
          <div className="command-results">
            {filteredItems.map((item) => <Link href={item.href} key={`${item.kind}-${item.href}-${item.label}`} onClick={() => { setOpen(false); setQuery(""); }}><span><small>{item.kind}</small><strong>{item.label}</strong><small>{item.detail}</small></span><span>↗</span></Link>)}
            {filteredItems.length === 0 && <p className="command-empty">No matching items in the current academic index.</p>}
          </div>
          <p className="command-hint"><Command size={12}/> Ctrl / Cmd + K to search · ESC to close</p>
        </section>
      </div>}
    </>
  );
}