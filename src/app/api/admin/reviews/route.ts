import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
export const runtime="nodejs";
export async function GET(){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 const db=createAdminClient(),[requests,reports]=await Promise.all([
  db.from("material_requests").select("*").order("created_at",{ascending:false}).limit(300),
  db.from("content_reports").select("*").order("created_at",{ascending:false}).limit(300)
 ]);
 if(requests.error||reports.error)return NextResponse.json({error:"Could not load review queues."},{status:500});
 return NextResponse.json({requests:requests.data??[],reports:reports.data??[]});
}
export async function PATCH(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const table=b.kind==="request"?"material_requests":b.kind==="report"?"content_reports":null,id=typeof b.id==="string"?b.id:"",status=String(b.status||"");
 if(!table||!id||!["new","in_progress","done"].includes(status))return NextResponse.json({error:"Valid item, type and status are required."},{status:400});
 const patch={status,admin_notes:typeof b.admin_notes==="string"?b.admin_notes.slice(0,2000):null,updated_at:new Date().toISOString()},db=createAdminClient();
 const {error}=await db.from(table).update(patch).eq("id",id);if(error)return NextResponse.json({error:"Could not update review item."},{status:500});
 await db.from("admin_audit_log").insert({action:table+".update",target_type:table,target_id:id,details:patch});
 return NextResponse.json({success:true});
}
