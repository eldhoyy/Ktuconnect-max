import Link from "next/link";
import { ArrowUpRight, ArrowRight, Search, Flag, Lock, CalendarDays, BookOpen } from "lucide-react";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";
import { LeafArt } from "@/components/pastel-ui";
export const dynamic="force-dynamic";
const profile={branch:"Mechanical",semester:"S3",scheme:"2024"};
export default function HomePage(){
 const now=new Date(),papers=getApprovedPapers(profile),future=papers.filter(p=>new Date(p.date+"T"+p.start+":00+05:30")>now).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start));
 const exam=future[0],source=timetable.documents.find(d=>d.semester===3&&d.scheme===2024);
 const dateLabel=new Intl.DateTimeFormat("en-IN",{day:"numeric",month:"short",timeZone:"Asia/Kolkata"}).format(now);
 const sessions=papers.filter(p=>p.date===exam?.date).slice(0,2);
 return <div className="screen page-enter">
  <section className="home-layout">
   <div className="home-primary">
    <div className="hero-head"><h1 className="hero-title">Start Your<br/>Exam Prep</h1><button className="circle-button" aria-label="Search" onClick={()=>document.dispatchEvent(new KeyboardEvent("keydown",{key:"k",ctrlKey:true}))}><Search size={22}/></button></div>
    <div className="tabs"><button className="tab active">Today</button><Link className="tab" href="/study-plan">Study plan</Link><Link className="tab" href="/study-plan">Weekly plan</Link></div>
    <Link href="/study-plan" className="goal-bar"><span className="goal-icon"><Flag size={22}/></span><span className="goal-label">Set your weekly study goal</span><ArrowRight className="goal-arrow" size={20}/></Link>
    <div className="session-carousel" aria-label="Upcoming exam sessions">
     {sessions.length? sessions.map((s,i)=><article className="session-card" key={s.code}><div className="session-top"><span className="glass-icon"><BookOpen size={21}/></span></div><div><p className="session-subject">{s.title}</p><h2 className="session-topic">{s.code}</h2></div><div className="session-bottom"><span className="session-time"><small>Verified exam · {s.date}</small><strong>{s.start} IST</strong></span><span className="round-action"><ArrowUpRight size={25}/></span></div><LeafArt/></article>):<article className="session-card"><span className="glass-icon"><BookOpen size={21}/></span><div><p className="session-subject">No upcoming verified paper</p><h2 className="session-topic">Your timetable will appear here</h2></div><div className="session-bottom"><small>Check the approved timetable source</small><span className="round-action"><ArrowUpRight size={25}/></span></div></article>}
    </div>
   </div>
   <div className="home-secondary">
    <div className="module-grid">
     <article className="pastel-card"><span className="glass-icon lock-icon"><Lock size={20}/></span><h3>Module 2</h3><small>Sample · Unlock date not set</small><p>Axial loading and deformation</p><LeafArt/></article>
     <article className="pastel-card pink"><span className="glass-icon lock-icon"><Lock size={20}/></span><h3>Module 3</h3><small>Sample · Unlock date not set</small><p>Thermal stresses</p><LeafArt/></article>
    </div>
    <p className="empty-note" style={{marginTop:14}}>Academic content shown here is a sample preview until a student profile and verified subject modules are connected.</p>
    <div className="empty-note">Today · {dateLabel} · Sample planning cards are not counted as real study activity.</div>
   </div>
  </section>
  {source&&<p className="source-meta" style={{textAlign:"center",marginTop:22}}>S3 MECHANICAL · 2024 SCHEME · <a href={source.url} target="_blank" rel="noreferrer">APPROVED TIMETABLE SOURCE ↗</a></p>}
 </div>
}
