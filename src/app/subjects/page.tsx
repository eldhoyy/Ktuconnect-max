import Link from "next/link";
import { Bell, BookOpen, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Donut } from "@/components/pastel-ui";
export const metadata={title:"Subjects"};
export const dynamic="force-dynamic";
type Subject={id:string;subject_code:string;title:string;semester:number;verification_status:string};
export default async function SubjectsPage(){
 let subjects:Subject[]=[];let available=false;
 try{const supabase=await createClient();const {data,error}=await supabase.from("subjects").select("id,subject_code,title,semester,verification_status").eq("verification_status","verified").order("title");if(!error){subjects=(data??[]) as Subject[];available=true}}catch{}
 const palette=["mint","lav","lil","pink"];
 return <div className="screen page-enter"><header className="screen-header"><Link className="circle-button" href="/" aria-label="Back">‹</Link><h1>Subjects</h1><span className="circle-button"><Bell size={19}/></span></header>
 <section className="surface-card task-overview"><div className="task-overview-copy"><div className="task-heading"><span className="task-icon"><ClipboardList size={22}/></span><div><strong>All Tasks</strong><small>Academic overview</small></div></div><div className="legend"><span className="legend-item"><i className="legend-dot"/>Today&apos;s task</span><span className="legend-item"><i className="legend-dot mint"/>Ongoing task</span><span className="legend-item"><i className="legend-dot pink"/>Completed task</span></div></div><Donut values={[50,30,20]}/></section>
 <div className="section-row"><h2>Your Subjects</h2><span>{subjects.length} verified</span></div>
 {subjects.length?<div className="subject-grid">{subjects.map((s,i)=><article className={"subject-tile "+palette[i%4]} key={s.id}><span className="glass-icon"><BookOpen size={21}/></span><h3>{s.title}</h3><small>{s.subject_code} · S{s.semester}</small><Link className="outline-link" href={"/subjects/"+encodeURIComponent(s.subject_code)}>Open notes <span>→</span></Link></article>)}</div>:<div className="empty-note">{available?"No verified subjects are available for this account yet.":"Subjects could not be loaded from Supabase. Check the connection and verified subject records."} Only verified curriculum records are shown; no sample subjects are presented as real data.</div>}
 </div>
}
