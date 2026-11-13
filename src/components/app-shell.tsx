"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { motionSeconds, motionSpring, pressScale } from "@/lib/motion";
import { House, CalendarCheck, GraduationCap, UserRound, LockKeyhole, ArrowLeft, Search, Sun, Moon, Menu, X, Accessibility, Bell } from "lucide-react";
import { useMotionPreference } from "@/components/motion-preferences";
const nav = [{ href: "/", label: "Home", Icon: House }, { href: "/study-plan", label: "Plan", Icon: CalendarCheck }, { href: "/subjects", label: "Learn", Icon: GraduationCap }, { href: "/profile", label: "Profile", Icon: UserRound }];
function active(h: string, p: string) { return h === "/" ? p === "/" : p === h || p.startsWith(h + "/"); }
function titleFor(path: string) {
  if (path === "/") return "";
  if (path.startsWith("/subjects/")) return decodeURIComponent(path.split("/")[2] || "Subject");
  const titles: Record<string, string> = { "/subjects": "Subjects", "/study-plan": "Exam schedule", "/profile": "Profile", "/notes": "Notes", "/pyq": "Previous papers", "/syllabus": "Syllabus", "/timetable": "Exam timetable", "/updates": "KTU updates", "/sources": "Sources & verification", "/about": "About Cohertx", "/onboarding": "Student setup", "/progress": "Progress", "/request": "Request materials", "/admin": "Admin centre", "/admin/login": "Admin sign in" };
  if (path.startsWith("/semesters/")) return "Semester " + path.split("/")[2];
  return titles[path] || "Cohertx";
}
function parentFor(path: string) {
  if (path.startsWith("/subjects/")) return "/subjects";
  if (path.startsWith("/semesters/")) return "/";
  if (path === "/pyq" || path === "/syllabus" || path === "/notes") return "/subjects";
  if (path === "/sources" || path === "/about") return "/profile";
  return "/";
}
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(), router = useRouter(), { reduceMotion, toggle } = useMotionPreference();
  const [theme, setTheme] = useState<"light" | "dark">("light"), [system, setSystem] = useState(true);
  const [menu, setMenu] = useState(false), [search, setSearch] = useState(false), [notifications, setNotifications] = useState(false);
  useEffect(() => { const saved = localStorage.getItem("datum-theme") || localStorage.getItem("cohertx-theme"); setSystem(!saved); setTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light"); }, []);
  useEffect(() => { const media = window.matchMedia("(prefers-color-scheme: dark)"); const sync = () => { if (system) { document.documentElement.dataset.theme = media.matches ? "dark" : "light"; setTheme(media.matches ? "dark" : "light"); } }; media.addEventListener("change", sync); return () => media.removeEventListener("change", sync); }, [system]);
  useEffect(() => { const f = (e: KeyboardEvent) => { if (e.key === "Escape") { setMenu(false); setSearch(false); setNotifications(false); } }; window.addEventListener("keydown", f); return () => window.removeEventListener("keydown", f); }, []);
  function mode(m: "light" | "dark" | "system") {
    const root = document.documentElement;
    if (!reduceMotion) root.classList.add("theme-transition");
    if (m === "system") {
      localStorage.removeItem("datum-theme"); localStorage.removeItem("cohertx-theme"); setSystem(true);
      const d = matchMedia("(prefers-color-scheme: dark)").matches; root.dataset.theme = d ? "dark" : "light"; setTheme(d ? "dark" : "light");
    } else {
      root.dataset.theme = m; localStorage.setItem("datum-theme", m); setTheme(m); setSystem(false);
    }
    window.setTimeout(() => root.classList.remove("theme-transition"), motionSeconds.theme * 1000);
  }
  function back() { if (window.history.length > 1) router.back(); else router.push(parentFor(pathname)); }
  const home = pathname === "/";
  return <>
    <header className={home ? "app-header home-header" : "app-header inner-header"}>
      {home ? <><Link href="/" className="header-wordmark" aria-label="Cohertx home">cohertx<span>.</span></Link><div className="header-right"><button className="header-circle" onClick={() => setSearch(true)} aria-label="Search"><Search size={22} strokeWidth={1.8}/></button><button className="header-circle" onClick={() => setMenu(true)} aria-label="Open menu and preferences"><Menu size={22} strokeWidth={1.8}/></button></div></> :
      <><button className="header-circle" onClick={back} aria-label="Go back"><ArrowLeft size={22} strokeWidth={1.8}/></button><h1>{titleFor(pathname)}</h1><span className="header-action">{["/subjects", "/study-plan"].includes(pathname) ? <button className="header-circle" onClick={() => setNotifications(true)} aria-label="Notifications"><Bell size={22} strokeWidth={1.8}/></button> : null}</span></>}
    </header>
    <main className="app-content">{children}</main>
    <nav className="floating-nav" aria-label="Main navigation">{nav.map(({ href, label, Icon }) => { const on = active(href, pathname); return <Link key={href} href={href} prefetch aria-label={label} aria-current={on ? "page" : undefined} className={on ? "nav-item active" : "nav-item"}><motion.span className="nav-icon" whileTap={reduceMotion ? undefined : pressScale} transition={{ duration: motionSeconds.fast }}>{on && <motion.i className="nav-active-indicator" layoutId="active-nav-indicator" transition={reduceMotion ? { duration: motionSeconds.fast } : motionSpring.navPill}/>}<Icon size={22} strokeWidth={1.8}/></motion.span></Link>; })}</nav>
    <AnimatePresence>{menu && <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionSeconds.fast }} onMouseDown={e => { if (e.target === e.currentTarget) setMenu(false); }}><motion.section className="settings-sheet" role="dialog" aria-modal="true" aria-label="Preferences" initial={reduceMotion ? { opacity: 0 } : { y: "100%" }} animate={reduceMotion ? { opacity: 1 } : { y: 0 }} exit={reduceMotion ? { opacity: 0 } : { y: "100%" }} transition={reduceMotion ? { duration: motionSeconds.fast } : motionSpring.sheet} drag={reduceMotion ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: .18 }} onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 520) setMenu(false); }}><div className="sheet-heading"><h2>Preferences</h2><button className="header-circle" onClick={() => setMenu(false)} aria-label="Close"><X size={22}/></button></div><p className="settings-label">APPEARANCE</p><div className="theme-options"><button className={theme === "light" && !system ? "selected" : ""} onClick={() => mode("light")}><Sun size={17}/>Light</button><button className={theme === "dark" && !system ? "selected" : ""} onClick={() => mode("dark")}><Moon size={17}/>Dark</button><button className={system ? "selected" : ""} onClick={() => mode("system")}>System</button></div><button className="preference-row" onClick={toggle} aria-pressed={reduceMotion}><span><Accessibility size={19}/>Reduce motion</span><strong>{reduceMotion ? "On" : "Off"}</strong></button><Link className="preference-row" href="/profile" onClick={() => setMenu(false)}><span><UserRound size={19}/>Profile settings</span><strong>↗</strong></Link><Link className="preference-row" href="/admin/login" onClick={() => setMenu(false)}><span><LockKeyhole size={19}/>Admin centre</span><strong>↗</strong></Link></motion.section></motion.div>}</AnimatePresence>
    <AnimatePresence>{search && <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionSeconds.fast }} onMouseDown={e => { if (e.target === e.currentTarget) setSearch(false); }}><motion.section className="search-sheet" role="dialog" aria-modal="true" aria-label="Search" initial={reduceMotion ? { opacity: 0 } : { y: 20, opacity: 0 }} animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { y: 12, opacity: 0 }} transition={reduceMotion ? { duration: motionSeconds.fast } : motionSpring.sheet} drag={reduceMotion ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: .18 }} onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 520) setSearch(false); }}><div className="sheet-heading"><h2>Search</h2><button className="header-circle" onClick={() => setSearch(false)} aria-label="Close"><X size={22}/></button></div><p>Browse your subjects, notes and previous question papers.</p><Link className="search-link" href="/subjects" onClick={() => setSearch(false)}>Browse subjects <span>↗</span></Link><Link className="search-link" href="/notes" onClick={() => setSearch(false)}>Browse notes <span>↗</span></Link><Link className="search-link" href="/pyq" onClick={() => setSearch(false)}>Previous papers <span>↗</span></Link></motion.section></motion.div>}</AnimatePresence>
    <AnimatePresence>{notifications && <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: motionSeconds.fast }} onMouseDown={e => { if (e.target === e.currentTarget) setNotifications(false); }}><motion.section className="settings-sheet" role="dialog" aria-modal="true" aria-label="Notifications" initial={reduceMotion ? { opacity: 0 } : { y: "100%" }} animate={reduceMotion ? { opacity: 1 } : { y: 0 }} exit={reduceMotion ? { opacity: 0 } : { y: "100%" }} transition={reduceMotion ? { duration: motionSeconds.fast } : motionSpring.sheet} drag={reduceMotion ? false : "y"} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: .18 }} onDragEnd={(_, info) => { if (info.offset.y > 110 || info.velocity.y > 520) setNotifications(false); }}><div className="sheet-heading"><h2>Notifications</h2><button className="header-circle" onClick={() => setNotifications(false)} aria-label="Close"><X size={22}/></button></div><div className="info-card"><Bell size={20}/><div><strong>You&apos;re all caught up</strong><p>Exam notices and reminders will appear here when verified updates are available.</p></div></div></motion.section></motion.div>}</AnimatePresence>
  </>;
}
