import Link from "next/link";
import { ArrowUpRight, Flag, Lock, BookOpen } from "lucide-react";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";
import { LeafArt } from "@/components/pastel-ui";
import { GoalBar } from "@/components/goal-bar";
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
    <div className="hero-head"><h1 className="hero-title">Start Your<br/>Exam Prep</h1></div>
    <div className="tabs"><button className="tab active">Today</button><Link className="tab" href="/study-plan">Study plan</Link><Link className="tab" href="/study-plan">Weekly plan</Link></div>
    <GoalBar/>
    <div className="session-carousel" aria-label="Upcoming exam sessions">
     {sessions.length? sessions.map((s)=><Link href="/study-plan" className="session-card" key={s.code}><div className="session-top"><span className="glass-icon"><BookOpen size={21}/></span></div><div><p className="session-subject">{s.title.toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}</p><h2 className="session-topic session-code">{s.code}</h2></div><div className="session-bottom"><span className="session-time"><small>Verified exam · {s.date}</small><strong>{s.start} IST</strong></span><span className="round-action"><ArrowUpRight size={25}/></span></div><LeafArt/></Link>):<Link href="/sources" className="session-card"><span className="glass-icon"><BookOpen size={21}/></span><div><p className="session-subject">No upcoming verified paper</p><h2 className="session-topic">Your timetable will appear here</h2></div><div className="session-bottom"><small>Check the approved timetable source</small><span className="round-action"><ArrowUpRight size={25}/></span></div></Link>}
    </div>
   </div>
   <div className="home-secondary">
    <div className="module-grid">
     <article className="pastel-card"><span className="glass-icon lock-icon"><Lock size={20}/></span><h3>Module 2</h3><small className="unlock-chip">Unlocks with your plan</small><p>Axial loading and deformation</p><LeafArt/></article>
     <article className="pastel-card pink"><span className="glass-icon lock-icon"><Lock size={20}/></span><h3>Module 3</h3><small>Unlocks with your plan</small><p>Thermal stresses</p><LeafArt/></article>
    </div>
    <div className="info-card"><BookOpen size={20}/><div><strong>Sample academic preview</strong><p>Academic content remains a sample until a student profile and verified subject modules are connected.</p></div></div>
    <div className="info-card"><Flag size={20}/><div><strong>Today · {dateLabel}</strong><p>Sample planning cards are not counted as real study activity.</p></div></div>
   </div>
  </section>
  {source&&<div className="info-card source-info"><BookOpen size={20}/><div><strong>Sample profile · S3 Mechanical · 2024 scheme</strong><p><a href={source.url} target="_blank" rel="noreferrer">Approved timetable source ↗</a></p></div></div>}
 </div>
}
