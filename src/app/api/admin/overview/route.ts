import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
export const runtime="nodejs";
export async function GET(){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 const db=createAdminClient(),[resources,pending,requests,reports,subjects,timetables,activity,analytics]=await Promise.all([
  db.from("study_resources").select("id",{count:"exact",head:true}),
  db.from("study_resources").select("id",{count:"exact",head:true}).neq("verification_status","approved"),
  db.from("material_requests").select("id",{count:"exact",head:true}).neq("status","done"),
  db.from("content_reports").select("id",{count:"exact",head:true}).neq("status","done"),
  db.from("subjects").select("id",{count:"exact",head:true}),
  db.from("timetable_sources").select("id",{count:"exact",head:true}),
  db.from("admin_audit_log").select("id,actor,action,target_type,target_id,created_at").order("created_at",{ascending:false}).limit(12),
  db.from("usage_events").select("feature,path,created_at").order("created_at",{ascending:false}).limit(5000)
 ]);
 const failures=[resources.error,pending.error,requests.error,reports.error,subjects.error,timetables.error,activity.error].filter(Boolean);
 if(failures.length)return NextResponse.json({error:"Admin tables are not ready. Apply Supabase migrations 001–007."},{status:503});
 const featureCounts:Record<string,number>={};for(const event of analytics.data??[])featureCounts[event.feature]=(featureCounts[event.feature]??0)+1;
 return NextResponse.json({counts:{resources:resources.count??0,pending:pending.count??0,requests:requests.count??0,reports:reports.count??0,subjects:subjects.count??0,timetableDocuments:timetables.count??0},activity:activity.data??[],analytics:featureCounts});
}
