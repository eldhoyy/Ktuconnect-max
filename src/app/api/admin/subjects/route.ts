import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
export const runtime="nodejs";
export async function GET(){if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});const db=createAdminClient();const {data,error}=await db.from("subjects").select("id,subject_code,title,semester,credits,verification_status,scheme_id,branch_id").order("semester").order("title").limit(1000);if(error)return NextResponse.json({error:"Could not load subjects."},{status:500});return NextResponse.json({subjects:data??[]});}
export async function POST(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const subject_code=typeof b.subject_code==="string"?b.subject_code.trim().toUpperCase():"",title=typeof b.title==="string"?b.title.trim():"",semester=Number(b.semester),scheme_id=String(b.scheme_id||""),branch_id=String(b.branch_id||"");
 if(!subject_code||!title||!Number.isInteger(semester)||semester<1||semester>12||!scheme_id||!branch_id)return NextResponse.json({error:"Code, title, semester, scheme and branch are required."},{status:400});
 const db=createAdminClient(),{data,error}=await db.from("subjects").insert({subject_code,title,semester,scheme_id,branch_id,credits:typeof b.credits==="number"?b.credits:null,verification_status:"pending"}).select("id").single();if(error)return NextResponse.json({error:"Could not create subject."},{status:500});await db.from("admin_audit_log").insert({action:"subject.create",target_type:"subject",target_id:data.id,details:{subject_code,title}});return NextResponse.json({success:true,id:data.id},{status:201});
}
export async function PATCH(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const id=String(b.id||"");if(!id)return NextResponse.json({error:"Subject id required."},{status:400});const patch:Record<string,unknown>={};
 for(const k of ["subject_code","title","semester","credits","scheme_id","branch_id","category","source_document_url"])if(k in b)patch[k]=b[k];
 if("verification_status" in b){if(!["pending","verified","rejected"].includes(String(b.verification_status)))return NextResponse.json({error:"Invalid verification status."},{status:400});patch.verification_status=b.verification_status;if(b.verification_status==="verified")patch.verified_at=new Date().toISOString();}
 const db=createAdminClient(),{error}=await db.from("subjects").update(patch).eq("id",id);if(error)return NextResponse.json({error:"Could not update subject."},{status:500});await db.from("admin_audit_log").insert({action:"subject.update",target_type:"subject",target_id:id,details:patch});return NextResponse.json({success:true});
}
export async function DELETE(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const id=String(b.id||"");if(!id)return NextResponse.json({error:"Subject id required."},{status:400});const db=createAdminClient(),{error}=await db.from("subjects").delete().eq("id",id);if(error)return NextResponse.json({error:"Could not delete subject."},{status:500});await db.from("admin_audit_log").insert({action:"subject.delete",target_type:"subject",target_id:id,details:{}});return NextResponse.json({success:true});
}
