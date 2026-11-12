"use client";
import { useMemo, useState } from "react";
import { Zap, ListFilter, ChartNoAxesColumn, CalendarDays, Info, X } from "lucide-react";
import { getApprovedPapers } from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";
import { Gauge } from "@/components/pastel-ui";
const profile = { branch: "Mechanical", semester: "S3", scheme: "2024" };
const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function StudyPlanPage() {
 const papers = getApprovedPapers(profile), now = new Date();
 const day = new Date(now.getFullYear(), now.getMonth(), now.getDate()), start = new Date(day);
 start.setDate(day.getDate() - ((day.getDay() + 6) % 7));
 const days = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(start); d.setDate(start.getDate() + i); const iso = [d.getFullYear(), String(d.getMonth()+1).padStart(2,"0"), String(d.getDate()).padStart(2,"0")].join("-"); return { iso, day: d.getDate(), past: d < day, today: d.toDateString() === day.toDateString(), exam: papers.some(p => p.date === iso), weekday: labels[d.getDay()] }; }), [papers, day, start]);
 const [selected, setSelected] = useState(days.find(d => d.today)?.iso ?? days[0].iso);
 const [todayOnly, setTodayOnly] = useState(false), [listView, setListView] = useState(false);
 const [sheetOpen, setSheetOpen] = useState(false);
 const visible = days.filter(d => !todayOnly || d.today);
 const selectedDay = days.find(d => d.iso === selected);
 const selectedPapers = papers.filter(p => p.date === selected);
 const month = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(day);
 const source = timetable.documents.find(d => d.semester === 3 && d.scheme === 2024);
 const bars = [38,52,82,64,45,100,58];
 return <div className="screen page-enter"><section className="schedule-layout">
  <article className="surface-card calendar-card">
   <div className="card-title-row"><h2>Study blocks</h2><div className="mini-actions"><button type="button" className={todayOnly?"mini-action selected":"mini-action"} aria-label="Toggle today only" aria-pressed={todayOnly} title="Toggle today only" onClick={() => setTodayOnly(v => !v)}><Zap size={17}/></button><button type="button" className={listView?"mini-action selected":"mini-action"} aria-label="Toggle list view" aria-pressed={listView} title="Toggle list or calendar view" onClick={() => setListView(v => !v)}><ListFilter size={17}/></button></div></div>
   {!listView && <><div className="weekdays">{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => <span key={d}>{d}</span>)}</div><div className="date-grid">{visible.map(x => <button type="button" key={x.iso} onClick={() => { setSelected(x.iso); setSheetOpen(true); }} aria-label={x.iso+(x.exam?", verified exam date":"")} aria-pressed={selected===x.iso} className={["date-cell",x.past?"past":"",x.today?"today":"",x.exam?"dot":"",!x.past&&!x.today&&x.exam?"range":"",selected===x.iso&&!x.today?"range":"",].filter(Boolean).join(" ")}>{x.day}</button>)}</div></>}
   {listView && <div className="date-list">{visible.map(x => <button type="button" className="date-list-row" key={x.iso} onClick={() => {setSelected(x.iso);setSheetOpen(true);}}><span>{x.weekday} · {x.iso}</span><strong>{x.exam?"Verified exam":"No verified exam"}</strong></button>)}</div>}
   <div className="weekly-progress"><div><strong>Weekly Progress</strong><small>Sample · Planner activity not connected</small></div><Gauge value={60}/></div>
  </article>
  <article className="surface-card study-day"><div className="study-day-heading"><span className="task-icon"><ChartNoAxesColumn size={24}/></span><div><strong>Study activity</strong><small>{month} · Sample chart</small></div></div><div className="bar-chart">{bars.map((v,i)=><div className="bar-col" key={labels[i]}><span className={i===5?"tooltip-pill":"bar-label"}>{labels[i]}</span><div className={i===5?"bar selected":"bar"} style={{height:v+"%"}}/><span className="bar-date">{i+1}</span></div>)}</div></article>
 </section><div className="info-card source-info"><Info size={20}/><div><strong>Verified calendar · Sample activity chart</strong><p>Calendar dots reflect approved S3 Mechanical timetable dates. Progress bars are Sample data and do not represent student activity.{source&&<> <a href={source.url} target="_blank" rel="noreferrer">Source ↗</a></>}</p></div></div>
 {sheetOpen && <div className="sheet-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSheetOpen(false);}}><section className="settings-sheet" role="dialog" aria-modal="true" aria-label="Selected date details"><div className="sheet-heading"><h2>{selectedDay?.weekday} · {selected}</h2><button className="header-circle" onClick={()=>setSheetOpen(false)} aria-label="Close date details"><X size={21}/></button></div>{selectedPapers.length ? selectedPapers.map(p=><article className="date-list-row" key={p.code}><strong>{p.code} · {p.title}</strong><span>{p.start}–{p.end} IST · Verified timetable</span></article>) : <div className="info-card"><CalendarDays size={20}/><div><strong>No verified exam listed</strong><p>No approved examination is recorded for this date. Student-entered dates remain unverified.</p></div></div>}</section></div>}
 </div>;
}
