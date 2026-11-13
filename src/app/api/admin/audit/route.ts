import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
export const runtime = "nodejs";
export async function GET() {
  if (!(await isAdminSession())) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const { data, error } = await createAdminClient().from("admin_audit_log").select("id,actor,action,target_type,target_id,details,created_at").order("created_at", { ascending: false }).limit(200);
  if (error) return NextResponse.json({ error: "Could not load the audit log." }, { status: 500 });
  return NextResponse.json({ entries: data ?? [] });
}
