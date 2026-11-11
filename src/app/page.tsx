import { BlueprintHome } from "@/components/home/blueprint-home";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";

export const dynamic = "force-dynamic";

const sampleProfile = {
  branch: "Mechanical",
  semester: "S3",
  scheme: "2024",
};

export default function HomePage() {
  const now = new Date();
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) =>
    dateParts.find((item) => item.type === type)?.value ?? "";
  const todayDate = `${part("year")}-${part("month")}-${part("day")}`;
  const todayLabel = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
  })
    .format(now)
    .toUpperCase();

  // Until a student profile is available, keep the sample exam and subject
  // list within one real branch/scheme so the preview never mixes departments.
  const samplePapers = getApprovedPapers(sampleProfile);
  const exam = samplePapers
    .filter(
      (item) =>
        new Date(`${item.date}T${item.start}:00+05:30`).getTime() > now.getTime(),
    )
    .sort(
      (a, b) =>
        a.date.localeCompare(b.date) || a.start.localeCompare(b.start),
    )[0];
  const source = timetable.documents.find(
    (document) =>
      document.semester === Number(sampleProfile.semester.replace("S", "")) &&
      document.scheme === Number(sampleProfile.scheme),
  );

  if (!exam || !source) {
    return (
      <main className="content-width no-exam-state">
        <h1>No upcoming verified exam date is available.</h1>
        <p>
          Check the timetable source page for the documents currently included.
        </p>
      </main>
    );
  }

  const subjects = samplePapers
    .filter((paper) => ["PCMET302", "GYMAT301"].includes(paper.code))
    .map((paper) => ({
      code: paper.code,
      title: paper.title,
      date: paper.date,
      sourceUrl: source.url,
    }));

  const days = Math.max(
    0,
    Math.round(
      (Date.parse(`${exam.date}T00:00:00Z`) -
        Date.parse(`${todayDate}T00:00:00Z`)) /
        86_400_000,
    ),
  );

  return (
    <BlueprintHome
      exam={{ ...exam, sourceUrl: source.url }}
      todayLabel={todayLabel}
      days={days}
      subjects={subjects}
    />
  );
}
