import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export const runtime = "nodejs";
export async function GET() {
 const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
 if (!configured) return NextResponse.json({ status:"degraded", supabase:"not_configured" }, { status:503 });
 try {
  const supabase = await createClient();
  const { error } = await supabase.from("subjects").select("id", { head:true, count:"exact" }).limit(1);
  if (error) return NextResponse.json({ status:"degraded", supabase:"query_failed" }, { status:503 });
  return NextResponse.json({ status:"ok", supabase:"connected" });
 } catch {
  return NextResponse.json({ status:"degraded", supabase:"unavailable" }, { status:503 });
 }
}
