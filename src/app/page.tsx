import { BlueprintHome } from "@/components/home/blueprint-home";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const now = new Date();
  const todayLabel = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short" }).format(now).toUpperCase();

  const exam = timetable.exams
    .filter((item) => item.semester === 3 && new Date(`${item.date}T${item.start}:00+05:30`).getTime() > now.getTime())
    .sort((a, b) => a.date.localeCompare(b.date) || a.start.localeCompare(b.start))[0];
  const source = timetable.documents.find((document) => document.semester === exam?.semester && document.scheme === exam?.scheme);
  const sampleExam = exam && source ? { ...exam, sourceUrl: source.url } : null;

  const samplePapers = getApprovedPapers({ branch: "Mechanical", semester: "3", scheme: "2024" });
  const subjects = samplePapers
    .filter((paper) => ["PCMET302", "GYMAT301"].includes(paper.code))
    .map((paper) => ({ code: paper.code, title: paper.title, date: paper.date, sourceUrl: source?.url ?? "" }));

  if (!sampleExam) {
    return <main className="content-width no-exam-state"><h1>No upcoming verified exam date is available.</h1><p>Check the timetable source page for the documents currently included.</p></main>;
  }

  return <BlueprintHome exam={sampleExam} todayLabel={todayLabel} subjects={subjects}/>;
}
