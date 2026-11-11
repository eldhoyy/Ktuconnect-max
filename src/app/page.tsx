import Link from "next/link";
import { BookOpen, CalendarDays, ChartNoAxesCombined } from "lucide-react";
import { LearnIcon, PlanIcon, ProgressIcon } from "@/components/icons/section-icons";

const destinations = [
  { href: "/notes", label: "Notes library", detail: "Find material by subject and semester", icon: LearnIcon },
  { href: "/pyq", label: "Previous papers", detail: "Study from past examination papers", icon: BookOpen },
  { href: "/study-plan", label: "Exam planner", detail: "Turn your dates into a workable plan", icon: PlanIcon },
];

export default function HomePage() {
  return (
    <main className="page-wrap">
      <section className="hero-panel">
        <div className="eyebrow"><span className="eyebrow-dot" /> THE KTU STUDENT DESK</div>
        <p className="hero-kicker">LEARN / PLAN / KEEP MOVING</p>
        <h1>Make room for<br /><em>better learning.</em></h1>
        <p className="hero-copy">Your KTU resources and exam planning, brought together in one calm, useful workspace.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/study-plan">Plan my exams <ChartNoAxesCombined size={17} /></Link>
          <Link className="button button-secondary" href="/notes">Browse notes <BookOpen size={17} /></Link>
        </div>
        <div className="hero-footnote"><CalendarDays size={14} /> Academic dates retain their source and verification status.</div>
        <div className="hero-index" aria-hidden="true"><span>01</span><span>08</span><span>SEMESTERS</span></div>
      </section>
      <section className="destination-grid" aria-label="Explore Cohertx">
        {destinations.map(({ href, label, detail, icon: Icon }, index) => (
          <Link className="destination-card" href={href} key={href}>
            <span className="card-index">0{index + 1}</span>
            <span className="destination-icon"><Icon width={20} height={20} /></span>
            <h2>{label}</h2><p>{detail}</p><span className="card-arrow">↗</span>
          </Link>
        ))}
      </section>
      <p className="quiet-note">A date entered by a student is not an official timetable. Always confirm examination details against the original KTU notice.</p>
    </main>
  );
}