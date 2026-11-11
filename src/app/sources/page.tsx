import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import timetable from "@/data/november-2026-timetables.json";
import topics from "@/data/important-topics.json";

export const metadata = {
  title: "Sources & verification",
  description: "How Datum labels timetable sources, past-paper patterns and academic information.",
};

export default function SourcesPage() {
  return (
    <main className="editorial-page sources-page">
      <header className="editorial-heading">
        <span className="section-overline">TRANSPARENCY / SOURCES</span>
        <h1>Trust the source.<br/><em>Know the limits.</em></h1>
        <p>Academic information is useful only when its origin and verification status are clear. This page explains what the current foundation uses—and what it does not claim.</p>
      </header>
      <section className="verification-callout"><ShieldCheck size={24}/><div><strong>Verified does not mean permanent.</strong><p>Timetable entries in the approved dataset are linked to the published timetable documents listed below. Always re-check the original notice for corrections or later revisions.</p></div></section>
      <section className="source-section">
        <span className="section-overline">01 / EXAM TIMETABLES</span>
        <h2>November 2026 source documents</h2>
        <p>These are the timetable PDFs referenced by the imported dataset. The home-page countdown uses a clearly labelled S5 Mechanical sample selected from these records.</p>
        <div className="source-list">{timetable.documents.map((document) => <article key={document.title}><div><span>S{document.semester} / {document.scheme} SCHEME</span><h3>{document.title}</h3><small>{document.documentNumber}</small></div><a href={document.url} target="_blank" rel="noreferrer" aria-label={`Open ${document.title}`}>Open PDF <ArrowUpRight size={14}/></a></article>)}</div>
        <p className="source-meta">Dataset source date: {timetable.sourceDate} · Publisher attribution in the imported record: {timetable.publisher}.</p>
      </section>
      <section className="source-section">
        <span className="section-overline">02 / PAST-PAPER PATTERNS</span>
        <h2>Patterns are evidence, not predictions.</h2>
        <p>The topic teaser uses the imported important-topics dataset. Entries that cite actual papers state how many papers were reviewed and explain the evidence. Items marked “Syllabus focus” are curriculum-derived and are not past-paper frequency analysis.</p>
        <div className="source-list compact-source-list">{Object.entries(topics).filter(([, value]) => value.papers > 0).map(([code, value]) => <article key={code}><div><span>{code}</span><h3>{value.subject}</h3><small>{value.papers} paper{value.papers === 1 ? "" : "s"} reviewed</small></div><span className="source-status">Evidence attached</span></article>)}</div>
      </section>
      <section className="source-section">
        <span className="section-overline">03 / VERIFICATION POLICY</span>
        <ul className="policy-list">
          <li>Only records that have passed the platform&apos;s approval process may be shown as approved resources.</li>
          <li>Student-entered examination dates are labelled unverified and are never presented as official timetable data.</li>
          <li>We do not generate fake AI answers, exam predictions, testimonials, student counts or progress statistics.</li>
          <li>Past-paper repetition can help prioritise revision, but it cannot guarantee what will appear in a future exam.</li>
          <li>Copyrighted materials should remain at their legitimate source; the platform should link rather than redistribute them without permission.</li>
        </ul>
      </section>
      <section className="editorial-note">
        <span className="section-overline">FOUND A PROBLEM?</span>
        <h2>Help keep the record accurate.</h2>
        <p>If a document link is broken or an academic detail needs correction, report it through the repository issue tracker.</p>
        <Link href="https://github.com/eldhoyy/Ktuconnect-max/issues" className="text-link" target="_blank">Report an issue <ArrowUpRight size={15}/></Link>
      </section>
    </main>
  );
}
