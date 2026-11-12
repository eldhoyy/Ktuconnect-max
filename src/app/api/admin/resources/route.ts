import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
export const runtime="nodejs";
const types=["video","notes","pdf","question_paper","reference"],statuses=["pending","under_review","approved","rejected","needs_recheck"];
const validUrl=(value:string)=>{try{const u=new URL(value);return u.protocol==="https:"||u.protocol==="http:";}catch{return false;}};
async function audit(db:ReturnType<typeof createAdminClient>,action:string,id:string|null,details:Record<string,unknown>){await db.from("admin_audit_log").insert({action,target_type:"study_resource",target_id:id,details});}
export async function GET(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 const url=new URL(request.url),status=url.searchParams.get("status"),type=url.searchParams.get("type"),q=url.searchParams.get("q"),db=createAdminClient();
 let query=db.from("study_resources").select("*").order("created_at",{ascending:false}).limit(500);
 if(status&&statuses.includes(status))query=query.eq("verification_status",status);
 if(type&&types.includes(type))query=query.eq("resource_type",type);
 if(q)query=query.ilike("title","%"+q.slice(0,100)+"%");
 const {data,error}=await query;if(error)return NextResponse.json({error:"Could not load resources."},{status:500});
 return NextResponse.json({resources:data??[]});
}
export async function POST(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const title=typeof b.title==="string"?b.title.trim():"",url=typeof b.resource_url==="string"?b.resource_url.trim():"",type=String(b.resource_type||"");
 if(!title||title.length>180||!validUrl(url)||!types.includes(type))return NextResponse.json({error:"Title, valid HTTP(S) URL and resource type are required."},{status:400});
 const db=createAdminClient(),payload={title,resource_url:url,resource_type:type,description:typeof b.description==="string"?b.description.slice(0,1000):null,subject_id:typeof b.subject_id==="string"?b.subject_id:null,module_id:typeof b.module_id==="string"?b.module_id:null,topic:typeof b.topic==="string"?b.topic.slice(0,180):null,academic_year:typeof b.academic_year==="string"?b.academic_year.slice(0,20):null,language:typeof b.language==="string"?b.language.slice(0,40):null,platform:typeof b.platform==="string"?b.platform.slice(0,80):null,verification_status:"pending"};
 const {data,error}=await db.from("study_resources").insert(payload).select("id").single();if(error)return NextResponse.json({error:"Could not create resource."},{status:500});
 await audit(db,"resource.create",data.id,{title});return NextResponse.json({success:true,id:data.id},{status:201});
}
export async function PATCH(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const id=typeof b.id==="string"?b.id:"";if(!id)return NextResponse.json({error:"Resource id is required."},{status:400});
 const patch:Record<string,unknown>={};
 for(const key of ["title","description","resource_url","resource_type","topic","academic_year","language","platform","verification_notes"])if(key in b)patch[key]=b[key];
 if("resource_type" in patch&&!types.includes(String(patch.resource_type)))return NextResponse.json({error:"Invalid resource type."},{status:400});
 if("resource_url" in patch&&!validUrl(String(patch.resource_url)))return NextResponse.json({error:"Invalid HTTP(S) URL."},{status:400});
 if("verification_status" in b){if(!statuses.includes(String(b.verification_status)))return NextResponse.json({error:"Invalid status."},{status:400});patch.verification_status=b.verification_status;if(b.verification_status==="approved")patch.verified_at=new Date().toISOString();}
 if(!Object.keys(patch).length)return NextResponse.json({error:"No changes supplied."},{status:400});
 const db=createAdminClient(),{error}=await db.from("study_resources").update(patch).eq("id",id);if(error)return NextResponse.json({error:"Could not update resource."},{status:500});
 await audit(db,"resource.update",id,patch);return NextResponse.json({success:true});
}
export async function DELETE(request:Request){
 if(!(await isAdminSession()))return NextResponse.json({error:"Unauthorized."},{status:401});
 let b:Record<string,unknown>;try{b=await request.json();}catch{return NextResponse.json({error:"Invalid JSON."},{status:400});}
 const id=typeof b.id==="string"?b.id:"";if(!id)return NextResponse.json({error:"Resource id is required."},{status:400});
 const db=createAdminClient(),{error}=await db.from("study_resources").delete().eq("id",id);if(error)return NextResponse.json({error:"Could not delete resource."},{status:500});
 await audit(db,"resource.delete",id,{});return NextResponse.json({success:true});
}
