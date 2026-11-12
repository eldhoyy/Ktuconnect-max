import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
export const runtime = "nodejs";
function ip(request:Request){return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";}
export async function POST(request:Request){
 const limit=rateLimit("material-request:"+ip(request),{limit:5,windowMs:60*60_000,blockMs:60*60_000});
 if(!limit.allowed)return NextResponse.json({error:"Too many requests. Try again later."},{status:429});
 let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid request."},{status:400});}
 if(!body||typeof body!=="object")return NextResponse.json({error:"Invalid request."},{status:400});
 const value=body as Record<string,unknown>,name=typeof value.name==="string"?value.name.trim():"",semester=typeof value.semester==="string"?value.semester.trim():"",subject=typeof value.subject==="string"?value.subject.trim().slice(0,160):null,requestText=typeof value.request_text==="string"?value.request_text.trim():"";
 if(name.length<2||name.length>100||!/^S[1-8]$/.test(semester)||requestText.length<5||requestText.length>2000)return NextResponse.json({error:"Please provide a name, semester and a request between 5 and 2,000 characters."},{status:400});
 try{const db=createAdminClient();const {error}=await db.from("material_requests").insert({name,semester,subject,request_text:requestText});if(error)throw error;return NextResponse.json({success:true},{status:201});}catch{return NextResponse.json({error:"Requests are temporarily unavailable. Please try again later."},{status:503});}
}
