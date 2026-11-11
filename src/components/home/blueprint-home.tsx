"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BookOpen, CalendarDays, ListChecks } from "lucide-react";
import { useMotionPreference } from "@/components/motion-preferences";

type Exam = { date: string; start: string; code: string; title: string; semester: number; scheme: number; sourceUrl: string };
type Subject = { code: string; title: string; date: string; sourceUrl: string };

const sampleTasks = [
  { id: "notes", title: "Review class notes", detail: "One module, key definitions", minutes: 25 },
  { id: "paper", title: "One past-paper question", detail: "Work it through without notes", minutes: 25 },
  { id: "revise", title: "Recall the main formulas", detail: "Short, closed-book revision", minutes: 25 },
];
const week = ["M", "T", "W", "T", "F", "S", "S"];

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(`${value}T00:00:00+05:30`)).toUpperCase();
}
function DimensionLine({ exam, todayLabel, days }: { exam: Exam; todayLabel: string; days: number }) {
  const { reduceMotion } = useMotionPreference();
  return <div className="dimension-wrap" aria-label={`${days} days from today to ${exam.code} on ${formatShortDate(exam.date)}`}>
    <div className="dimension-labels"><span>TODAY · {todayLabel}</span><span>{formatShortDate(exam.date)} · {exam.code}</span></div>
    <svg className="dimension-svg" viewBox="0 0 680 76" role="img" aria-hidden="true">
      <defs><marker id="dimension-arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto-start-reverse"><path d="M0 0L8 4L0 8" fill="none" stroke="#FF6B2C" strokeWidth="1.2"/></marker></defs>
      <motion.path d="M18 37H662" stroke="#FF6B2C" strokeWidth="1.6" fill="none" markerStart="url(#dimension-arrow)" markerEnd="url(#dimension-arrow)" initial={reduceMotion ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduceMotion ? 0 : .9, ease: "easeOut", delay: .42 }}/>
      <motion.path d="M18 22V52M662 22V52" stroke="#FF6B2C" strokeWidth="1.6" initial={reduceMotion ? false : { opacity: 0, scaleY: .2 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: reduceMotion ? 0 : .2, delay: 1.18 }} style={{ transformOrigin: "center" }}/>
      <motion.path d="M340 25V49" stroke="#FF6B2C" strokeWidth="1.4" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.28 }}/>
      <motion.rect x="278" y="8" width="124" height="58" rx="8" fill="#FF6B2C" initial={reduceMotion ? false : { opacity: 0, scale: .82 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: reduceMotion ? 0 : .28, delay: 1.32, type: "spring", stiffness: 240, damping: 18 }} style={{ transformOrigin: "340px 37px" }}/>
      <motion.text x="340" y="43" textAnchor="middle" fill="#0A1628" fontFamily="var(--font-jetbrains-mono)" fontSize="17" fontWeight="500" initial={reduceMotion ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.48 }}>{days} DAYS</motion.text>
      <motion.circle cx="18" cy="37" r="4" fill="#FF6B2C" animate={reduceMotion ? undefined : { opacity: [.55, 1, .55] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}/>
    </svg>
    <div className="dimension-caption"><span>EXAM DATE · {exam.start} IST</span><a href={exam.sourceUrl} target="_blank" rel="noreferrer">VIEW APPROVED TIMETABLE ↗</a></div>
  </div>;
}

function TodayCard() {
  const { reduceMotion } = useMotionPreference();
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("datum-sample-tasks");
    if (saved) { try { setCompleted(JSON.parse(saved) as string[]); } catch { setCompleted([]); } }
    setReady(true);
  }, []);
  function toggleTask(id: string) {
    setCompleted((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("datum-sample-tasks", JSON.stringify(next));
      return next;
    });
  }
  return <motion.aside className="today-card" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .55, delay: .5, type: "spring", stiffness: 90, damping: 18 }} aria-label="Sample daily study plan">
    <div className="today-head"><div><span className="today-overline">YOUR DAILY DESK</span><h2>Today · 75 min</h2></div><span className="streak-chip">4-DAY STREAK <span className="sample-dot">SAMPLE</span></span></div>
    <div className="week-strip" aria-label="Sample four-day streak this week">{week.map((day, index) => <div className="week-day" key={`${day}-${index}`}><span>{day}</span><motion.i initial={reduceMotion ? false : { scaleY: 0 }} animate={{ scaleY: index < 4 ? 1 : .18 }} transition={{ duration: reduceMotion ? 0 : .22, delay: reduceMotion ? 0 : .72 + index * .07 }} className={index < 4 ? "is-filled" : ""}/></div>)}</div>
    <div className="task-list">{sampleTasks.map((task, index) => {
      const done = completed.includes(task.id);
      return <motion.button key={task.id} type="button" className={done ? "task-row is-done" : "task-row"} onClick={() => toggleTask(task.id)} initial={reduceMotion ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: reduceMotion ? 0 : .28, delay: reduceMotion ? 0 : .78 + index * .08 }} aria-pressed={done}>
        <span className="task-check"><AnimatePresence>{done && <motion.svg viewBox="0 0 18 18" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} exit={{ pathLength: 0 }}><motion.path d="M3 9l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></motion.svg>}</AnimatePresence></span>
        <span className="task-copy"><strong>{task.title}</strong><small>{task.detail}</small></span><span className="task-minutes">{task.minutes} MIN</span>
      </motion.button>;
    })}</div>
    <div className="today-foot"><span>{ready ? completed.length : 0}/3 TASKS DONE <span className="sample-note">· SAMPLE PLAN</span></span><Link href="/study-plan">Start focus <ArrowRight size={15}/></Link></div>
  </motion.aside>;
}

function SubjectRow({ subject, index }: { subject: Subject; index: number }) {
  return <Link href={`/subjects/${subject.code}`} className="subject-row">
    <span className="subject-index">0{index + 1}</span>
    <span className="subject-main"><strong>{subject.title}</strong><small>{subject.code}</small></span>
    <span className="subject-progress"><span className="subject-progress-track"><i/></span><small>Progress starts with your first session</small></span>
    <span className="subject-date"><small>NEXT PAPER</small><strong>{formatShortDate(subject.date)}</strong></span><ArrowRight className="subject-arrow" size={18}/>
  </Link>;
}

export function BlueprintHome({ exam, todayLabel, days, subjects }: { exam: Exam; todayLabel: string; days: number; subjects: Subject[] }) {
  const { reduceMotion } = useMotionPreference();
  const { scrollY } = useScroll();
  const gridY = useTransform(scrollY, [0, 1200], [0, 12]);
  return <main className="blueprint-home">
    <section className="blueprint-hero">
      <motion.div className="blueprint-grid" aria-hidden="true" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduceMotion ? 0 : .8 }} style={reduceMotion ? undefined : { y: gridY }}/>
      <div className="blueprint-hero-inner">
        <div className="hero-tag"><span className="signal-square"/> S3 · NOVEMBER 2026 EXAMS <span className="hero-sample-tag">SAMPLE VIEW</span></div>
        <motion.h1 initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: .06, delayChildren: .08 } } }}>
          <motion.span variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>{days} days to your first paper.</motion.span>
          <motion.span variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}>Let&apos;s use every one.</motion.span>
        </motion.h1>
        <DimensionLine exam={exam} todayLabel={todayLabel.toUpperCase()} days={days}/>
        <div className="hero-actions"><Link href="/onboarding" className="blueprint-button primary">Plan my exams <ArrowRight size={17}/></Link><Link href="/notes" className="blueprint-button outline">Notes <BookOpen size={17}/></Link></div>
        <p className="hero-honesty"><span/>Only verified KTU dates. No guessed timetables.</p>
      </div>
    </section>
    <div className="today-overlap"><TodayCard/></div>
    <section className="subjects-section content-width">
      <div className="section-heading"><div><span className="section-kicker">YOUR SUBJECTS</span><h2>Keep the next paper in view.</h2></div><span className="sample-outline">S3 TIMETABLE SAMPLE · NOT A PROFILE</span></div>
      <div className="subjects-list">{subjects.map((subject, index) => <SubjectRow key={subject.code} subject={subject} index={index}/>)}</div>
    </section>
    <section className="value-section content-width">
      <div className="section-heading"><div><span className="section-kicker">ONE WORKING SPACE</span><h2>Less searching. More doing.</h2></div></div>
      <div className="value-grid">
        <article className="value-item"><span className="value-icon"><BookOpen size={21}/></span><h3>Learn</h3><p>Notes, papers and syllabus organised around each subject.</p><Link href="/notes">Browse notes <ArrowRight size={14}/></Link></article>
        <article className="value-item"><span className="value-icon"><CalendarDays size={21}/></span><h3>Plan</h3><p>Use verified exam dates to decide what to work on next.</p><Link href="/study-plan">Build a plan <ArrowRight size={14}/></Link></article>
        <article className="value-item"><span className="value-icon"><ListChecks size={21}/></span><h3>Track</h3><p>Record real study sessions and see your progress take shape.</p><Link href="/progress">View progress <ArrowRight size={14}/></Link></article>
      </div>
    </section>
    <section className="closing-section"><div className="closing-inner"><span className="section-kicker">START WITH THE NEXT STEP</span><h2>Plan the work.<br/>Then work the plan.</h2><div className="hero-actions"><Link href="/onboarding" className="blueprint-button primary">Plan my exams <ArrowRight size={17}/></Link><Link href="/notes" className="blueprint-button dark-outline">Browse notes <BookOpen size={17}/></Link></div></div><div className="closing-grid" aria-hidden="true"/></section>
  </main>;
}
