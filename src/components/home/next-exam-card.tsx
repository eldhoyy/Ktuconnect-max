"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";

type Exam = { date: string; start: string; code: string; title: string; semester: number; scheme: number; sourceUrl: string };

function getRemaining(target: number, now: number) {
  const total = Math.max(0, target - now);
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total % 86_400_000) / 3_600_000);
  const minutes = Math.floor((total % 3_600_000) / 60_000);
  const seconds = Math.floor((total % 60_000) / 1_000);
  return { days, hours, minutes, seconds, passed: total === 0 };
}

export function NextExamCard({ exam }: { exam: Exam | null }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const interval = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => window.clearInterval(interval);
  }, []);

  if (!exam) {
    return <aside className="next-exam-card next-exam-empty"><span className="section-overline">NEXT EXAM / SAMPLE</span><p>No upcoming date is available in the current timetable data.</p></aside>;
  }

  const target = new Date(`${exam.date}T${exam.start}:00+05:30`).getTime();
  const countdown = now === null ? null : getRemaining(target, now);
  const dateLabel = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${exam.date}T00:00:00+05:30`));

  return (
    <aside className="next-exam-card">
      <div className="exam-card-heading"><span className="section-overline">NEXT EXAM / SAMPLE</span><span className="sample-label">S5 MECHANICAL SAMPLE</span></div>
      <p className="exam-subject-code">{exam.code}</p>
      <h2>{exam.title}</h2>
      <div className="exam-date-line"><Clock3 size={14} /><span>{dateLabel} · {exam.start} IST</span><span className="verified-label">Source-linked</span></div>
      <div className="countdown" aria-live="off" aria-label={countdown === null ? "Loading countdown" : countdown.passed ? "Exam start time has passed" : `${countdown.days} days, ${countdown.hours} hours, ${countdown.minutes} minutes until exam`}>
        {[
          ["DAYS", countdown?.days],
          ["HRS", countdown?.hours],
          ["MIN", countdown?.minutes],
          ["SEC", countdown?.seconds],
        ].map(([label, value]) => <div className="countdown-unit" key={label}><strong>{value === undefined ? "--" : String(value).padStart(2, "0")}</strong><span>{label}</span></div>)}
      </div>
      <Link href={exam.sourceUrl} target="_blank" rel="noreferrer" className="exam-source-link">View timetable source <ArrowUpRight size={14} /></Link>
    </aside>
  );
}
