import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
const clean = (v: unknown, max = 500) => typeof v === "string" ? v.trim().slice(0, max) : "";
export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { data, error } = await createAdminClient().from("important_topic_patterns").select("*").order("subject_code").limit(1000);
  if (error) return NextResponse.json({ error: "Could not load topic patterns. Confirm migration 006 is applied." }, { status: 503 });
  return NextResponse.json({ topics: data ?? [] });
}
export async function POST(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let b: Record<string, unknown>; try { b = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const subject_code = clean(b.subject_code, 40).toUpperCase(), subject_title = clean(b.subject_title, 180), evidence = clean(b.evidence, 4000);
  const paper_count = Number(b.paper_count), topics = Array.isArray(b.topics) ? b.topics.filter(x => typeof x === "string").slice(0, 100) : [];
  if (!subject_code || !subject_title || !evidence || !Number.isInteger(paper_count) || paper_count < 0) return NextResponse.json({ error: "Subject code, title, evidence and a non-negative paper count are required." }, { status: 400 });
  const db = createAdminClient(), { data, error } = await db.from("important_topic_patterns").insert({ subject_code, subject_title, evidence, paper_count, topics, interpretation_label: "Past-paper patterns, not predictions" }).select("id").single();
  if (error) return NextResponse.json({ error: "Could not create pattern. Subject codes must be unique." }, { status: 400 });
  await db.from("admin_audit_log").insert({ action: "topic_pattern.create", target_type: "important_topic_pattern", target_id: data.id, details: { subject_code } });
  return NextResponse.json({ success: true, id: data.id }, { status: 201 });
}
export async function PATCH(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let b: Record<string, unknown>; try { b = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const id = clean(b.id, 100); if (!id) return NextResponse.json({ error: "Pattern ID is required." }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if ("subject_code" in b) patch.subject_code = clean(b.subject_code, 40).toUpperCase();
  if ("subject_title" in b) patch.subject_title = clean(b.subject_title, 180);
  if ("evidence" in b) patch.evidence = clean(b.evidence, 4000);
  if ("paper_count" in b) { const count = Number(b.paper_count); if (!Number.isInteger(count) || count < 0) return NextResponse.json({ error: "Paper count must be a non-negative integer." }, { status: 400 }); patch.paper_count = count; }
  if ("topics" in b) patch.topics = Array.isArray(b.topics) ? b.topics.filter(x => typeof x === "string").slice(0, 100) : [];
  patch.updated_at = new Date().toISOString();
  const db = createAdminClient(), { error } = await db.from("important_topic_patterns").update(patch).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update pattern." }, { status: 500 });
  await db.from("admin_audit_log").insert({ action: "topic_pattern.update", target_type: "important_topic_pattern", target_id: id, details: patch });
  return NextResponse.json({ success: true });
}
export async function DELETE(request: Request) {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  let b: Record<string, unknown>; try { b = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON." }, { status: 400 }); }
  const id = clean(b.id, 100); if (!id) return NextResponse.json({ error: "Pattern ID is required." }, { status: 400 });
  const db = createAdminClient(), { error } = await db.from("important_topic_patterns").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not delete pattern." }, { status: 500 });
  await db.from("admin_audit_log").insert({ action: "topic_pattern.delete", target_type: "important_topic_pattern", target_id: id, details: {} });
  return NextResponse.json({ success: true });
}
