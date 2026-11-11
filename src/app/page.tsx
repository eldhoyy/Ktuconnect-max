import dynamicImport from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, BookOpen, ShieldCheck } from "lucide-react";
import { HeroIllustration } from "@/components/home/hero-illustration";
import { MagneticLink } from "@/components/home/magnetic-link";
import { NextExamCard } from "@/components/home/next-exam-card";
import { MotionReveal } from "@/components/motion-preferences";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";
import topics from "@/data/important-topics.json";

export const dynamic = "force-dynamic";

const StorySections = dynamicImport(
  () => import("@/components/home/story-sections").then((module) => module.StorySections),
  { loading: () => <div className="story-loading" aria-label="Loading the Learn, Plan and Track overview" /> },
);

export default function HomePage() {
  const samplePapers = getApprovedPapers({ branch: "Mechanical", semester: "5", scheme: "2024" });
  const currentTime = Date.now();
  const nextExam = samplePapers
    .filter((exam) => new Date(`${exam.date}T${exam.start}:00+05:30`).getTime() > currentTime)
    .sort((left, right) => left.date.localeCompare(right.date) || left.start.localeCompare(right.start))[0];
  const source = timetable.documents.find((document) => document.semester === 5 && document.scheme === 2024);
  const exam = nextExam && source ? { ...nextExam, sourceUrl: source.url } : null;
  const timetableSlots = new Set(timetable.exams.map((item) => `${item.semester}-${item.slot}`)).size;
  const subjectEntries = timetable.exams.length;
  const topic = topics.PCMET302;
  const evidenceTopics = topic.topics.filter((item) => item.priority === "High" || item.priority === "Medium").slice(0, 3);

  return (
    <main className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy-column">
          <MotionReveal>
            <div className="eyebrow"><span className="eyebrow-dot" /> THE KTU STUDENT DESK</div>
            <p className="hero-kicker">LEARN / PLAN / KEEP MOVING</p>
            <h1 id="hero-title" className="hero-title"><span>Learn it.</span><span><em>Plan it.</em></span><span>Track it.</span></h1>
            <p className="hero-copy">Your KTU notes, past papers and exam plan—connected by subject, designed to make the next step clear.</p>
            <div className="hero-actions">
              <MagneticLink href="/onboarding" className="button button-primary">Plan my exams <ArrowUpRight size={17}/></MagneticLink>
              <Link href="/notes" className="button button-secondary">Browse notes <BookOpen size={17}/></Link>
            </div>
            <div className="hero-footnote"><ShieldCheck size={15}/> Source-aware academic information. No guessed exam dates.</div>
          </MotionReveal>
        </div>
        <div className="hero-visual-column"><HeroIllustration /></div>
        <div className="hero-bottom-line"><span>01—03 / A BETTER STUDY RHYTHM</span><a href="#learn-plan-track">Explore the system <ArrowDown size={13}/></a></div>
      </section>

      <section className="next-exam-strip" aria-label="Next examination preview">
        <div className="next-exam-context">
          <span className="section-overline">A TIMETABLE, MADE USEFUL</span>
          <h2>Start with what’s next.</h2>
          <p>A live countdown from the approved November 2026 timetable. This preview is deliberately labelled as a sample, not your personal exam schedule.</p>
          <Link href="/timetable" className="text-link">See timetable details <ArrowUpRight size={15}/></Link>
        </div>
        <NextExamCard exam={exam} />
      </section>

      <div id="learn-plan-track">
        <StorySections
          subjectEntries={subjectEntries}
          timetableSlots={timetableSlots}
          sourceDocuments={timetable.documents.length}
          topics={evidenceTopics}
          topicSubject={topic.subject}
          topicPaperCount={topic.papers}
        />
      </div>

      <section className="home-closing">
        <span className="section-overline">A SEMESTER, IN GOOD ORDER</span>
        <h2>Make the next hour<br/><em>work for the next exam.</em></h2>
        <p>Bring your resources and revision plan into one connected workspace.</p>
        <MagneticLink href="/onboarding" className="button button-primary">Plan my exams <ArrowUpRight size={17}/></MagneticLink>
      </section>
    </main>
  );
}
