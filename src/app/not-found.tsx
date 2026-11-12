import Link from "next/link";
import { SearchX } from "lucide-react";
export default function NotFound(){return <main className="screen page-enter"><section className="surface-card empty-state"><span className="task-icon"><SearchX size={24}/></span><h1>Page not found</h1><p className="muted-copy">This page may have moved or the address may be incorrect.</p><Link className="outline-link" href="/">Back to home →</Link></section></main>;}
