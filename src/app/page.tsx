import {HomeScreen} from "@/components/reference-ui/home-screen";
import {getApprovedPapers} from "@/lib/approved-timetable";
import timetable from "@/data/november-2026-timetables.json";
export const dynamic="force-dynamic";
export default function HomePage(){const now=new Date();const papers=getApprovedPapers({branch:"Mechanical",semester:"S3",scheme:"2024"});const next=papers.filter(p=>new Date(p.date+"T"+p.start+":00+05:30").getTime()>now.getTime()).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start))[0];const source=timetable.documents.find(d=>d.semester===3&&d.scheme===2024);return <HomeScreen nextExam={next&&source?{...next,sourceUrl:source.url}:null}/>;}
