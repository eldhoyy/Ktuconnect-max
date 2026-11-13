"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error(error);},[error]);return <main className="screen page-enter"><section className="surface-card empty-state"><span className="task-icon"><AlertCircle size={24}/></span><h1>Something went wrong</h1><p className="muted-copy">The page could not be loaded. Please try again.</p><button className="outline-link" onClick={reset}>Try again</button><Link className="outline-link" href="/">Back to home →</Link></section></main>;}
