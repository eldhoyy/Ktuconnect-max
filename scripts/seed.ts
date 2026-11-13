import { loadEnvConfig } from "@next/env";
import { createAdminClient } from "../src/lib/supabase/admin";
import timetable from "../src/data/november-2026-timetables.json";
import topicPatterns from "../src/data/important-topics.json";

loadEnvConfig(process.cwd());
const supabase = createAdminClient();

async function seedTopicPatterns() {
  const rows = Object.entries(topicPatterns).map(([subject_code, item]) => ({
    subject_code,
    subject_title: item.subject,
    paper_count: item.papers,
    evidence: item.evidence,
    topics: item.topics,
    interpretation_label: "Past-paper patterns, not predictions",
    source_file: "src/data/important-topics.json",
    updated_at: new Date().toISOString(),
  }));
  const { error } = await supabase.from("important_topic_patterns").upsert(rows, { onConflict: "subject_code" });
  if (error) throw new Error("Could not seed topic patterns: " + error.message);
  console.log(`Seeded ${rows.length} evidence-backed topic pattern records.`);
}

async function seedTimetables() {
  const { data: university, error: universityError } = await supabase
    .from("universities").select("id").eq("short_name", "KTU").single();
  if (universityError || !university) throw new Error("KTU university row is missing. Apply migrations 001–006 first.");

  const { data: programme, error: programmeError } = await supabase
    .from("programmes").select("id").eq("university_id", university.id).eq("short_name", "B.Tech").single();
  if (programmeError || !programme) throw new Error("KTU B.Tech programme row is missing. Apply migration 001 first.");

  for (const document of timetable.documents) {
    const { data: scheme, error: schemeError } = await supabase.from("academic_schemes")
      .select("id").eq("university_id", university.id).eq("scheme_year", document.scheme).single();
    if (schemeError || !scheme) throw new Error(`Academic scheme ${document.scheme} is missing.`);

    const sourceValues = {
      university_id: university.id,
      source_url: document.url,
      source_title: document.title,
      published_at: new Date(timetable.sourceDate + "T00:00:00Z").toISOString(),
      verification_status: "verified" as const,
      verification_notes: `Imported from the repository's approved timetable catalogue; document ${document.documentNumber}.`,
    };
    const { data: existingSource, error: sourceLookupError } = await supabase.from("timetable_sources")
      .select("id").eq("source_url", document.url).maybeSingle();
    if (sourceLookupError) throw sourceLookupError;
    let sourceId = existingSource?.id;
    if (sourceId) {
      const { error } = await supabase.from("timetable_sources").update(sourceValues).eq("id", sourceId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("timetable_sources").insert(sourceValues).select("id").single();
      if (error || !data) throw error ?? new Error("Could not create timetable source.");
      sourceId = data.id;
    }

    const examSession = "November 2026";
    const { data: existingTimetable, error: timetableLookupError } = await supabase.from("exam_timetables")
      .select("id").eq("source_id", sourceId).eq("exam_session", examSession).maybeSingle();
    if (timetableLookupError) throw timetableLookupError;
    const timetableValues = {
      university_id: university.id,
      scheme_id: scheme.id,
      programme_id: programme.id,
      semester: document.semester,
      exam_session: examSession,
      version_label: document.documentNumber,
      source_id: sourceId,
      status: "verified" as const,
    };
    let timetableId = existingTimetable?.id;
    if (timetableId) {
      const { error } = await supabase.from("exam_timetables").update(timetableValues).eq("id", timetableId);
      if (error) throw error;
    } else {
      const { data, error } = await supabase.from("exam_timetables").insert(timetableValues).select("id").single();
      if (error || !data) throw error ?? new Error("Could not create verified timetable.");
      timetableId = data.id;
    }

    const events = timetable.exams.filter(exam => exam.semester === document.semester && exam.scheme === document.scheme)
      .map(exam => ({
        timetable_id: timetableId,
        subject_code: exam.code,
        subject_title: exam.title,
        starts_at: new Date(exam.date + "T" + exam.start + ":00+05:30").toISOString(),
        ends_at: new Date(exam.date + "T" + exam.end + ":00+05:30").toISOString(),
      }));
    const { error: deleteError } = await supabase.from("exam_events").delete().eq("timetable_id", timetableId);
    if (deleteError) throw deleteError;
    for (let index = 0; index < events.length; index += 500) {
      const { error } = await supabase.from("exam_events").insert(events.slice(index, index + 500));
      if (error) throw error;
    }
    console.log(`Seeded verified S${document.semester} ${document.scheme} timetable: ${events.length} papers.`);
  }
}

async function main() {
  await seedTopicPatterns();
  await seedTimetables();
  console.warn("S3 Mechanical subjects and syllabus modules were not seeded: this repository does not contain a verified S3 Mechanical curriculum/module source file. Past-paper topics are not being misrepresented as official syllabus modules.");
}
main().catch(error => {
  console.error(error instanceof Error ? error.message : "Seed failed.");
  process.exitCode = 1;
});
