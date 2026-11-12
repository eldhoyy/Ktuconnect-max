import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
export const runtime="nodejs";
export async function POST(request:Request){
 const ip=request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown",limit=rateLimit("content-report:"+ip,{limit:5,windowMs:60*60_000,blockMs:60*60_000});if(!limit.allowed)return NextResponse.json({error:"Too many reports. Try again later."},{status:429});
 let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const report_type=String(b.report_type||""),details=typeof b.details==="string"?b.details.trim():"",subject_code=typeof b.subject_code==="string"?b.subject_code.trim().slice(0,40):null,resource_id=typeof b.resource_id==="string"?b.resource_id:null;
 if(!["broken_link","incorrect_info"].includes(report_type)||details.length<5||details.length>2000)return NextResponse.json({error:"Choose a report type and provide details."},{status:400});
 const db=createAdminClient(),{error}=await db.from("content_reports").insert({report_type,details,subject_code,resource_id});if(error)return NextResponse.json({error:"Reports are temporarily unavailable."},{status:503});return NextResponse.json({success:true},{status:201});
}
