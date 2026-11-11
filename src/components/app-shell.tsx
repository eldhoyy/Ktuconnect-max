"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, Command, Home, Search, X } from "lucide-react";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/notes", label: "Learn", icon: BookOpen },
  { href: "/study-plan", label: "Plan", icon: CalendarDays },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

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
        <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 5h9v9H5zM18 5h9v22h-9zM5 18h9v9H5z" fill="currentColor"/><path d="M9 9h1v1H9zM22 9h1v14h-1zM9 22h1v1H9z" fill="var(--canvas)"/></svg></span><span>cohertx<span className="brand-period">.</span></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(({ href, label }) => <Link href={href} key={href}>{label}</Link>)}</nav>
        <button className="search-trigger" onClick={() => setOpen(true)} aria-label="Search"><Search size={17}/><span>Search</span><kbd>⌘ K</kbd></button>
      </header>
      {children}
      <nav className="mobile-tabs" aria-label="Mobile navigation">{links.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={19}/><span>{label}</span></Link>)}</nav>
      {open && <div className="command-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
        <section className="command-dialog" role="dialog" aria-modal="true" aria-label="Search Cohertx">
          <div className="command-input"><Search size={18}/><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search subjects, notes, papers…" /><button onClick={() => setOpen(false)} aria-label="Close search"><X size={18}/></button></div>
          <div className="command-results">{[{ href: "/notes", label: "Browse notes" }, { href: "/pyq", label: "Previous question papers" }, { href: "/syllabus", label: "Syllabus" }, { href: "/study-plan", label: "Study plan" }].filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).map((item) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}<span>↗</span></Link>)}</div>
          <p className="command-hint">ESC to close · Search index will connect to approved resources in Stage 3</p>
        </section>
      </div>}
    </>
  );
}