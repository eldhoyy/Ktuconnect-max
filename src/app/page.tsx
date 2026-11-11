import Link from "next/link";
import { BookOpen, CalendarDays, ChartNoAxesCombined, Command, Search } from "lucide-react";

const destinations = [
  { href: "/notes", label: "Notes library", detail: "Find material by subject and semester", icon: BookOpen },
  { href: "/pyq", label: "Previous papers", detail: "Study from past examination papers", icon: Search },
  { href: "/study-plan", label: "Exam planner", detail: "Turn your dates into a workable plan", icon: CalendarDays },
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
        <div className="hero-footnote"><Command size={14} /> Press <kbd>⌘ K</kbd> to find a subject or resource</div>
        <div className="hero-index" aria-hidden="true"><span>01</span><span>08</span><span>SEMESTERS</span></div>
      </section>
      <section className="destination-grid" aria-label="Explore Cohertx">
        {destinations.map(({ href, label, detail, icon: Icon }, index) => (
          <Link className="destination-card" href={href} key={href}>
            <span className="card-index">0{index + 1}</span>
            <span className="destination-icon"><Icon size={20} strokeWidth={1.7} /></span>
            <h2>{label}</h2><p>{detail}</p><span className="card-arrow">↗</span>
          </Link>
        ))}
      </section>
      <p className="quiet-note">Academic dates and resources are shown with their verification status. Always refer to official KTU notices for final confirmation.</p>
    </main>
  );
}