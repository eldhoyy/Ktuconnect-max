import Link from "next/link";
import { Zap, ListFilter, ChartNoAxesColumn } from "lucide-react";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";
import { Gauge } from "@/components/pastel-ui";
export const metadata={title:"Exam schedule"};
export const dynamic="force-dynamic";
export default function StudyPlanPage(){
 const profile={branch:"Mechanical",semester:"S3",scheme:"2024"},papers=getApprovedPapers(profile),now=new Date();
 const day=new Date(now.getFullYear(),now.getMonth(),now.getDate()),start=new Date(day);start.setDate(day.getDate()-((day.getDay()+6)%7));
 const days=Array.from({length:14},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);const iso=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");return {iso,day:d.getDate(),past:d<day,today:d.toDateString()===day.toDateString(),exam:papers.some(p=>p.date===iso)}});
 const month=new Intl.DateTimeFormat("en",{month:"long",year:"numeric"}).format(day),source=timetable.documents.find(d=>d.semester===3&&d.scheme===2024);
 const bars=[38,52,82,64,45,100,58],labels=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
 return <div className="screen page-enter"><section className="schedule-layout">
 <article className="surface-card calendar-card"><div className="card-title-row"><h2>Study blocks</h2><div className="mini-actions"><span className="mini-action"><Zap size={17}/></span><span className="mini-action"><ListFilter size={17}/></span></div></div><div className="weekdays">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=><span key={i}>{d}</span>)}</div><div className="date-grid">{days.map(x=><div key={x.iso} className={["date-cell",x.past?"past":"",x.today?"today":"",x.exam?"dot":"",!x.past&&!x.today&&x.exam?"range":""].filter(Boolean).join(" ")} title={x.exam?"Verified exam date":undefined}>{x.day}</div>)}</div><div className="weekly-progress"><div><strong>Weekly Progress</strong><small>Sample · Planner activity not connected</small></div><Gauge value={60}/></div></article>
 <article className="surface-card study-day"><div className="study-day-heading"><span className="task-icon"><ChartNoAxesColumn size={24}/></span><div><strong>Study activity</strong><small>{month} · Sample chart</small></div></div><div className="bar-chart">{bars.map((v,i)=><div className="bar-col" key={i}><span className={i===5?"tooltip-pill":"bar-label"}>{i===5?"Sat":labels[i]}</span><div className={i===5?"bar selected":"bar"} style={{height:v+"%"}}/><span className="bar-date">{i+1}</span></div>)}</div></article></section><div className="info-card source-info"><ChartNoAxesColumn size={20}/><div><strong>Verified calendar · Sample activity chart</strong><p>Calendar dots reflect approved S3 Mechanical timetable dates. Progress bars are Sample data and do not represent student activity.{source&&<> <a href={source.url} target="_blank" rel="noreferrer">Source ↗</a></>}</p></div></div></div>
}