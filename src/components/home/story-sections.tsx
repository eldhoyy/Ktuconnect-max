"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, Layers3 } from "lucide-react";
import { useMotionPreference } from "@/components/motion-preferences";

type Topic = { name: string; priority: string; evidence: string };
type Props = { subjectEntries: number; timetableSlots: number; sourceDocuments: number; topics: Topic[]; topicSubject: string; topicPaperCount: number };

function CountUp({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 55, damping: 20 });
  const [display, setDisplay] = useState(0);
  const { reduceMotion } = useMotionPreference();

  useEffect(() => {
    if (inView) count.set(reduceMotion ? value : value);
  }, [count, inView, reduceMotion, value]);
  useMotionValueEvent(spring, "change", (latest) => setDisplay(Math.round(latest)));

  return <div className="data-count"><strong ref={ref}>{reduceMotion ? value : display.toLocaleString("en-IN")}</strong><span>{label}</span></div>;
}

function StoryStage({ number, label, title, description, children, className = "" }: { number: string; label: string; title: string; description: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { reduceMotion } = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.45, 1, 1, 0.65]);
  const y = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [22, 0, 0, -16]);

  return (
    <motion.section ref={ref} className={`story-stage ${className}`} style={reduceMotion ? undefined : { opacity, y }}>
      <div className="story-copy">
        <span className="story-index">{number} / {label}</span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className="story-visual">{children}</div>
    </motion.section>
  );
}

function Spotlight({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  function move(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }
  return <div ref={ref} className={`spotlight-panel ${className}`} onPointerMove={move}>{children}</div>;
}

function EmptyHeatmap() {
  return <div className="empty-heatmap" aria-label="No study sessions recorded yet">{Array.from({ length: 35 }, (_, index) => <span key={index} />)}</div>;
}

function EmptyRing({ label }: { label: string }) {
  return <div className="empty-ring-item">
    <svg viewBox="0 0 76 76" role="img" aria-label={`${label}: no progress recorded yet`}>
      <circle cx="38" cy="38" r="31" fill="none" stroke="var(--line)" strokeWidth="5" />
      <circle cx="38" cy="38" r="31" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeDasharray="0 195" transform="rotate(-90 38 38)" />
    </svg>
    <span>{label}</span>
  </div>;
}

export function StorySections({ subjectEntries, timetableSlots, sourceDocuments, topics, topicSubject, topicPaperCount }: Props) {
  const firstTopics = topics.slice(0, 3);
  return (
    <div className="story-wrap">
      <div className="story-intro">
        <span className="section-overline">ONE CONNECTED WORKFLOW</span>
        <h2>Three parts.<br /><em>One clearer semester.</em></h2>
        <p>Keep the material you learn, the plan you follow and the progress you build in the same place.</p>
        <div className="data-counts">
          <CountUp value={subjectEntries} label="subject entries in timetable data" />
          <CountUp value={timetableSlots} label="published timetable slots" />
          <CountUp value={sourceDocuments} label="source timetable documents" />
        </div>
        <p className="count-note">Counts reflect the imported November 2026 timetable file. A verified question-paper total is not available yet.</p>
      </div>

      <div className="story-track">
        <StoryStage number="01" label="LEARN" title="Start with the right material." description="Notes, previous papers and syllabus belong beside the subject you are studying—not scattered across tabs." className="learn-stage">
          <Spotlight className="learn-composition">
            <div className="learn-paper learn-notes"><span className="visual-tag">NOTES / MODULE 01</span><strong>Build the basics.</strong><span className="visual-line long" /><span className="visual-line" /><span className="visual-line mid" /><span className="visual-highlight">Core concepts</span></div>
            <div className="learn-paper learn-pyq"><span className="visual-tag">PAST PAPER / 2025</span><strong>Question 04</strong><span className="visual-line long" /><span className="visual-line mid" /><span className="visual-line" /><span className="visual-line short" /></div>
            <div className="learn-syllabus"><Layers3 size={17}/><span>SYLLABUS</span><strong>Module 01—04</strong><small>Structured by subject</small></div>
            <div className="learn-caption"><BookOpen size={15}/> Subject-centred learning</div>
          </Spotlight>
        </StoryStage>

        <StoryStage number="02" label="PLAN" title="Turn exam dates into a workable day." description="A timetable is the starting point. A useful plan breaks the time before each exam into focused, manageable sessions." className="plan-stage">
          <Spotlight className="plan-composition">
            <div className="plan-date-block"><span>NOV</span><strong>23</strong><small>MON / SAMPLE</small></div>
            <div className="plan-agenda">
              <span className="visual-tag">A DAY, AT A GLANCE</span>
              <div><time>09:00</time><span className="agenda-mark" /><p>Review class notes</p></div>
              <div><time>11:30</time><span className="agenda-mark agenda-mark-warm" /><p>Work through a past paper</p></div>
              <div><time>15:00</time><span className="agenda-mark" /><p>Revise key concepts</p></div>
              <small className="agenda-note">Illustrative layout — not a generated student plan.</small>
            </div>
            <CalendarDays className="plan-calendar-icon" size={24}/>
          </Spotlight>
        </StoryStage>

        <StoryStage number="03" label="TRACK" title="See the work add up." description="Your own sessions will shape your streak, subject progress and revision history. Nothing is pre-filled or guessed." className="track-stage">
          <Spotlight className="track-composition">
            <div className="track-topline"><span className="visual-tag">YOUR STUDY RECORD</span><span className="record-empty">READY TO BEGIN</span></div>
            <div className="track-main">
              <div><strong>Activity map</strong><small>No sessions recorded yet</small><EmptyHeatmap/></div>
              <div className="ring-group"><EmptyRing label="Subjects"/><EmptyRing label="Modules"/></div>
            </div>
            <p className="track-footnote">Progress starts with your first completed focus session.</p>
          </Spotlight>
        </StoryStage>
      </div>

      <section className="pattern-teaser" aria-labelledby="pattern-title">
        <div className="pattern-heading">
          <span className="section-overline">PAST-PAPER PATTERNS / {topicSubject}</span>
          <h2 id="pattern-title">Look back to revise smarter.</h2>
          <p>These are recurring topics observed in the supplied papers, not predictions of future exam questions.</p>
          <span className="pattern-evidence">{topicPaperCount} past papers reviewed for this subject</span>
        </div>
        <div className="pattern-list">
          {firstTopics.map((topic, index) => <article className="pattern-row" key={topic.name}>
            <span className="pattern-number">0{index + 1}</span>
            <div><span className="pattern-priority">{topic.priority} priority in reviewed papers</span><h3>{topic.name}</h3><p>{topic.evidence}</p></div>
          </article>)}
          <Link href="/subjects/PCMET302" className="text-link">Explore subject pattern <ArrowUpRight size={15}/></Link>
        </div>
      </section>
      <section className="future-slots" aria-label="Future community sections">
        {/* TODO: Add verified student testimonials only after permission and source confirmation. */}
        {/* TODO: Add audience information only when supported by real product usage data. */}
      </section>
    </div>
  );
}
