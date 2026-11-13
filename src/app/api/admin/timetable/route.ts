import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const candidateStatuses = ["discovered", "downloaded", "parsed", "under_review", "verified", "rejected", "superseded"];
const sourceStatuses = ["pending", "verified", "rejected", "superseded"];
const text = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const db = createAdminClient();
  const [candidates, sources, timetables] = await Promise.all([
    db.from("timetable_discovery_candidates").select("*").order("discovered_at", { ascending: false }).limit(500),
    db.from("timetable_sources").select("*").order("created_at", { ascending: false }).limit(500),
    db.from("exam_timetables").select("id,semester,exam_session,version_label,status,created_at,source_id").order("created_at", { ascending: false }).limit(500),
  ]);
  if (candidates.error || sources.error || timetables.error) return NextResponse.json({ error: "Could not load timetable records. Confirm migrations 001–007 are applied." }, { status: 503 });
  return NextResponse.json({ candidates: candidates.data ?? [], sources: sources.data ?? [], timetables: timetables.data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const noticeTitle = text(body.notice_title, 240), noticeUrl = text(body.notice_url, 1000), discoveredFrom = text(body.discovered_from_url, 1000);
  if (!noticeTitle || !validHttpUrl(noticeUrl) || !validHttpUrl(discoveredFrom)) return NextResponse.json({ error: "Notice title and valid HTTP(S) notice/source URLs are required." }, { status: 400 });
  const db = createAdminClient();
  const { data, error } = await db.from("timetable_discovery_candidates").insert({
    university_id: text(body.university_id), programme_id: text(body.programme_id) || null,
    scheme_id: text(body.scheme_id) || null, semester: Number.isInteger(Number(body.semester)) ? Number(body.semester) : null,
    exam_session: text(body.exam_session, 120) || null, notice_title: noticeTitle, notice_url: noticeUrl,
    document_url: text(body.document_url, 1000) || null, discovered_from_url: discoveredFrom,
    published_at: text(body.published_at, 50) || null, status: "discovered",
  }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not add candidate. Check the university ID and duplicate notice URL." }, { status: 400 });
  await db.from("admin_audit_log").insert({ action: "timetable_candidate.create", target_type: "timetable_discovery_candidate", target_id: data.id, details: { notice_title: noticeTitle } });
  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}

function validHttpUrl(value: string) {
  try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; }
}

export async function PATCH(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const id = text(body.id, 100), kind = body.kind === "source" ? "source" : "candidate";
  const status = text(body.status, 40), notes = text(body.review_notes ?? body.verification_notes, 2000);
  const allowed = kind === "source" ? sourceStatuses : candidateStatuses;
  if (!id || !allowed.includes(status)) return NextResponse.json({ error: "A valid record ID and status are required." }, { status: 400 });
  const db = createAdminClient(), table = kind === "source" ? "timetable_sources" : "timetable_discovery_candidates";
  const patch = kind === "source"
    ? { verification_status: status, verification_notes: notes, verified_at: status === "verified" ? new Date().toISOString() : null }
    : { status, review_notes: notes, reviewed_at: new Date().toISOString() };
  const { error } = await db.from(table).update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update timetable record." }, { status: 500 });
  await db.from("admin_audit_log").insert({ action: table + ".update", target_type: table, target_id: id, details: patch });
  return NextResponse.json({ success: true });
}
