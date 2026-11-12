"use client";
import { useCallback, useEffect, useState } from "react";
import { BookOpen, CalendarDays, LogOut, Plus, RefreshCw, Trash2, Check, X, AlertTriangle } from "lucide-react";
type Resource={id:string;title:string;resource_url:string;resource_type:string;verification_status:string;description?:string|null;created_at:string};
type ReviewItem={id:string;name?:string;semester?:string;subject?:string|null;request_text?:string;report_type?:string;details?:string;status:string;admin_notes?:string|null;created_at:string};
type Overview={counts:Record<string,number>;activity:{id:number;action:string;target_type:string;created_at:string}[];analytics:Record<string,number>};
const tabs=[["overview","Overview"],["resources","Resources"],["review","Review queues"],["subjects","Subjects"],["timetable","Timetable"],["topics","Important topics"],["settings","Settings"]] as const;
export default function AdminDashboard(){
 const [tab,setTab]=useState<string>("overview"),[overview,setOverview]=useState<Overview|null>(null),[resources,setResources]=useState<Resource[]>([]),[requests,setRequests]=useState<ReviewItem[]>([]),[reports,setReports]=useState<ReviewItem[]>([]),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const [title,setTitle]=useState(""),[url,setUrl]=useState(""),[type,setType]=useState("notes"),[filter,setFilter]=useState("all");
 const load = useCallback(
  async () => {
   setBusy(true);
   setError("");
   try {
    const [o, r, q] = await Promise.all([
     fetch("/api/admin/overview", { cache: "no-store" }),
     fetch("/api/admin/resources", { cache: "no-store" }),
     fetch("/api/admin/reviews", { cache: "no-store" }),
    ]);
    const od = await o.json(), rd = await r.json(), qd = await q.json();
    if (!o.ok) throw new Error(od.error || "Overview unavailable");
    if (!r.ok) throw new Error(rd.error || "Resources unavailable");
    if (!q.ok) throw new Error(qd.error || "Review queues unavailable");
    setOverview(od);
    setResources(rd.resources || []);
    setRequests(qd.requests || []);
    setReports(qd.reports || []);
   } catch (e) {
    setError(e instanceof Error ? e.message : "Could not load admin data.");
   } finally {
    setBusy(false);
   }
  },
  []
 );
 useEffect(() => { void load(); }, [load]);
 async function signOut(){await fetch("/api/admin/logout",{method:"POST"});window.location.href="/admin/login";}
 async function createResource(e:React.FormEvent){e.preventDefault();setError("");const r=await fetch("/api/admin/resources",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({title,resource_url:url,resource_type:type})});const d=await r.json();if(!r.ok){setError(d.error||"Could not save resource.");return;}setTitle("");setUrl("");await load();}
 async function updateResource(id:string,status:string){const r=await fetch("/api/admin/resources",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({id,verification_status:status})});if(!r.ok){const d=await r.json();setError(d.error||"Could not update resource.");return;}await load();}
 async function deleteResource(id:string){if(!confirm("Delete this resource permanently?"))return;const r=await fetch("/api/admin/resources",{method:"DELETE",headers:{"content-type":"application/json"},body:JSON.stringify({id})});if(!r.ok){setError("Could not delete resource.");return;}await load();}
 async function updateReview(kind:"request"|"report",item:ReviewItem,status:string){const r=await fetch("/api/admin/reviews",{method:"PATCH",headers:{"content-type":"application/json"},body:JSON.stringify({kind,id:item.id,status,admin_notes:item.admin_notes||""})});if(!r.ok){setError("Could not update review item.");return;}await load();}
 const allReviews=[...requests.map(x=>({...x,kind:"request" as const})),...reports.map(x=>({...x,kind:"report" as const}))];
 const pendingResources=resources.filter(x=>filter==="all"||x.verification_status===filter);
 return <main className="admin-shell">
  <header className="admin-heading"><div><p className="section-overline">COHERTX / ADMIN CENTRE</p><h1>Workspace management</h1><p className="muted-copy">Review resources, academic data and student requests.</p></div><div className="admin-actions"><button className="outline-link" onClick={()=>void load()}><RefreshCw size={16}/> Refresh</button><button className="outline-link" onClick={signOut}><LogOut size={16}/> Sign out</button></div></header>
  {error&&<div className="info-card admin-alert"><AlertTriangle size={20}/><div><strong>Action needs attention</strong><p>{error}</p></div></div>}
  <nav className="admin-tabs" aria-label="Admin sections">{tabs.map(([id,label])=><button key={id} className={tab===id?"active":""} onClick={()=>setTab(id)}>{label}</button>)}</nav>
  {tab==="overview"&&<section className="admin-content">
   <div className="admin-stats">{[["Resources",overview?.counts.resources],["Pending review",overview?.counts.pending],["Requests",overview?.counts.requests],["Reports",overview?.counts.reports],["Subjects",overview?.counts.subjects],["Timetable docs",overview?.counts.timetableDocuments]].map(([label,value])=><article className="surface-card admin-stat" key={String(label)}><span>{label}</span><strong>{busy?"…":Number(value||0).toLocaleString()}</strong></article>)}</div>
   <div className="admin-two-col"><section className="surface-card"><h2>Consented feature analytics</h2><p className="muted-copy">Recent usage events; anonymous browser activity only.</p>{Object.entries(overview?.analytics||{}).sort((a,b)=>b[1]-a[1]).map(([k,v])=><div className="admin-metric" key={k}><span>{k.replaceAll("_"," ")}</span><strong>{v}</strong></div>)}</section><section className="surface-card"><h2>Recent admin activity</h2>{overview?.activity.length?overview.activity.map(a=><div className="admin-metric" key={a.id}><span>{a.action} · {a.target_type}</span><small>{new Date(a.created_at).toLocaleString()}</small></div>):<p className="muted-copy">No admin actions recorded yet.</p>}</section></div>
  </section>}
  {tab==="resources"&&<section className="admin-content"><section className="surface-card"><h2>Add a resource</h2><form className="admin-resource-form" onSubmit={createResource}><label>Title<input value={title} onChange={e=>setTitle(e.target.value)} required maxLength={180}/></label><label>Resource URL<input type="url" value={url} onChange={e=>setUrl(e.target.value)} required placeholder="https://…"/></label><label>Type<select value={type} onChange={e=>setType(e.target.value)}><option value="notes">Notes</option><option value="pdf">PDF</option><option value="question_paper">PYQ</option><option value="video">Video</option><option value="reference">Link / Reference</option></select></label><button className="goal-save"><Plus size={17}/> Add for review</button></form></section><div className="section-row"><h2>Resource library</h2><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">All statuses</option><option value="pending">Pending</option><option value="under_review">Under review</option><option value="approved">Approved</option><option value="rejected">Rejected</option></select></div><div className="admin-list">{pendingResources.map(item=><article className="surface-card admin-row" key={item.id}><div><strong>{item.title}</strong><p>{item.resource_type} · {item.verification_status}</p><a href={item.resource_url} target="_blank" rel="noreferrer">{item.resource_url}</a></div><div className="admin-actions"><button className="outline-link" onClick={()=>void updateResource(item.id,"approved")} aria-label={"Approve "+item.title}><Check size={16}/> Approve</button><button className="outline-link" onClick={()=>void updateResource(item.id,"rejected")} aria-label={"Reject "+item.title}><X size={16}/> Reject</button><button className="outline-link" onClick={()=>void deleteResource(item.id)} aria-label={"Delete "+item.title}><Trash2 size={16}/></button></div></article>)}</div></section>}
  {tab==="review"&&<section className="admin-content"><h2>Material requests and reports</h2><div className="admin-list">{allReviews.map(item=><article className="surface-card admin-row" key={item.kind+item.id}><div><span className="admin-kicker">{item.kind} · {item.status}</span><strong>{item.kind==="request"?item.request_text:item.details}</strong><p>{item.name||item.report_type} · {item.semester||item.subject||"Academic content"}</p><small>{new Date(item.created_at).toLocaleString()}</small></div><div className="admin-actions"><button className="outline-link" onClick={()=>void updateReview(item.kind,item,"in_progress")}>In progress</button><button className="outline-link" onClick={()=>void updateReview(item.kind,item,"done")}>Done</button></div></article>)}{!allReviews.length&&<p className="muted-copy">No open requests or reports.</p>}</div></section>}
  {tab==="subjects"&&<section className="admin-content"><section className="surface-card"><h2>Verified subject catalogue</h2><p className="muted-copy">Subject and module CRUD uses the approved curriculum records. This workspace will show verified records after the official syllabus source has been imported.</p><a className="outline-link" href="/subjects">View public subjects <BookOpen size={16}/></a></section></section>}
  {tab==="timetable"&&<section className="admin-content"><section className="surface-card"><h2>Timetable documents</h2><p className="muted-copy">The November 2026 approved catalogue is imported by the seed script. Student-entered dates remain unverified and cannot be promoted from this screen.</p><a className="outline-link" href="/sources">Review source catalogue <CalendarDays size={16}/></a></section></section>}
  {tab==="topics"&&<section className="admin-content"><section className="surface-card"><h2>Important topics</h2><p className="muted-copy">Past-paper patterns, not predictions. Evidence and paper counts are stored in the important topic patterns table.</p></section></section>}
  {tab==="settings"&&<section className="admin-content"><section className="surface-card"><h2>Admin safety</h2><p className="muted-copy">Login is rate-limited. Sessions are signed, HTTP-only and expire after 12 hours. Admin actions are written to the audit log.</p><p className="muted-copy">Keep ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET and SUPABASE_SERVICE_ROLE_KEY in Vercel server-side environment variables only.</p></section></section>}
 </main>;
}
