import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays, ChartNoAxesCombined } from "lucide-react";

export const metadata = {
  title: "About",
  description: "Why Cohertx brings KTU learning resources and exam planning together.",
};

export default function AboutPage() {
  return (
    <main className="editorial-page">
      <header className="editorial-heading">
        <span className="section-overline">ABOUT / COHERTX</span>
        <h1>A clearer way<br/><em>through the semester.</em></h1>
        <p>Cohertx is being built around one simple idea: learning material, exam planning and study progress should support each other—not live in separate corners.</p>
      </header>
      <section className="about-principles">
        <article><BookOpen size={22}/><span>01 / LEARN</span><h2>Keep the material close.</h2><p>Notes, previous question papers, syllabus modules and academic updates belong beside the subject they support.</p></article>
        <article><CalendarDays size={22}/><span>02 / PLAN</span><h2>Make time usable.</h2><p>Use source-aware examination dates to organise a realistic study plan. Student-entered dates remain visibly unverified.</p></article>
        <article><ChartNoAxesCombined size={22}/><span>03 / TRACK</span><h2>Let progress be yours.</h2><p>Study streaks and subject progress should come from real sessions you complete—not pre-filled numbers or invented activity.</p></article>
      </section>
      <section className="editorial-note">
        <span className="section-overline">BUILDING IN PUBLIC</span>
        <h2>One careful stage at a time.</h2>
        <p>The platform is being developed in reviewed stages. Searchable learning resources, connected subject pages and the complete personal planner are still being built. Until then, the interface labels sample content and unavailable features clearly.</p>
        <Link href="/sources" className="text-link">Read the sources and verification policy <ArrowUpRight size={15}/></Link>
      </section>
    </main>
  );
}
