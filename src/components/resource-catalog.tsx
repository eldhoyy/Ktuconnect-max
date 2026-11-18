"use client";

import { useMemo, useState } from "react";
import catalogue from "@/../public/data/keralatimetable-resource-index.json";
import notesCatalogue from "@/../public/data/ktu-notes-links.json";

type Resource = {
  path: string; name: string; category: string; size_bytes: number;
  source_url: string; download_url: string;
};
const resources = (catalogue as { resources: Resource[] }).resources;
type NoteLink = { title:string; module:string; course_code:string; branch:string; semester:string; resource_url:string; source_page:string };
const noteLinks = (notesCatalogue as { resources: NoteLink[] }).resources;
const labels: Record<string,string> = {
  notes: "Notes", syllabus: "Syllabus", timetable: "Timetables",
  "question-papers": "Question papers", "question-papers-tools": "Question paper tools",
  "catalogue-data": "Academic catalogues", "activity-points": "Activity points",
  "pdf-tools": "PDF tools", "website-tools": "Web tools",
  "automation-tools": "Automation scripts", notices: "Notices", documents: "Documents",
  other: "Other resources",
};
const pretty = (value:string) => labels[value] ?? value.replaceAll("-", " ");

export function ResourceCatalog({ initialCategory }: { initialCategory?: string }) {
  const [query,setQuery] = useState("");
  const [category,setCategory] = useState(initialCategory ?? "all");
  const categories = useMemo(() => ["all",...Array.from(new Set(resources.map(r=>r.category))).sort()],[]);
  const filtered = useMemo(() => resources.filter(r =>
    (category === "all" || r.category === category) &&
    (r.path.toLowerCase().includes(query.toLowerCase()) || r.category.toLowerCase().includes(query.toLowerCase()))
  ),[category,query]);
  return <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
    <div className="mb-7">
      <p className="text-sm font-semibold tracking-wide text-violet-600">KTU CONNECT · RESOURCE HUB</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">KTU learning resources</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Explore notes, syllabus pages, question-paper tools, timetables, notices and utilities indexed from the KeralaTimetable repository. Open resources at their pinned source location.</p>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
        <span className="rounded-full bg-violet-50 px-3 py-1">{resources.length} indexed files</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1">Source snapshot: 9612b2a</span>
      </div>
    </div>
    <label className="mb-3 block text-sm font-medium text-slate-700" htmlFor="resource-search">Search resources</label>
    <input id="resource-search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by subject, file or category…" className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"/>
    <div className="mb-6 flex flex-wrap gap-2">
      {categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={`rounded-full px-3 py-2 text-xs font-medium transition ${category===c?"bg-slate-900 text-white":"bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{c==="all"?"All resources":pretty(c)}</button>)}
    </div>
    {(category === "all" || category === "notes") && <section className="mb-10">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">Available notes PDFs</h2>
        <p className="mt-1 text-sm text-slate-500">Direct module and subject downloads extracted from the source notes pages.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {noteLinks.filter(n => [n.title,n.course_code,n.branch,n.semester,n.module].join(" ").toLowerCase().includes(query.toLowerCase())).map((n,i)=><article key={n.resource_url} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{n.branch} · {n.semester} · {n.course_code}</p>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">{n.title}</h3>
          {n.module && <p className="mt-1 text-xs text-slate-500">{n.module}</p>}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <a href={n.resource_url} target="_blank" rel="noreferrer" className="font-semibold text-violet-700 hover:underline">Download PDF ↗</a>
            <a href={n.source_page} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline">Source page</a>
          </div>
        </article>)}
      </div>
    </section>}
    <p className="mb-3 text-sm text-slate-500">Showing {filtered.length} of {resources.length} indexed files</p>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map(r=><article key={r.path} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">{pretty(r.category)}</p>
        <h2 className="mt-2 break-words text-sm font-semibold text-slate-900">{r.name}</h2>
        <p className="mt-1 break-all text-xs text-slate-500">{r.path}</p>
        <div className="mt-4 flex items-center gap-4 text-sm">
          <a href={r.download_url} target="_blank" rel="noreferrer" className="font-semibold text-violet-700 hover:underline">Open resource ↗</a>
          <a href={r.source_url} target="_blank" rel="noreferrer" className="text-slate-500 hover:underline">Source</a>
        </div>
      </article>)}
    </div>
    {filtered.length===0 && <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">No resources match that search.</p>}
    <p className="mt-8 text-xs leading-5 text-slate-500">Files are linked to the pinned upstream snapshot. Binary PDFs and assets are not mirrored into KTU Connect Max storage yet; they open from the source repository.</p>
  </main>;
}
