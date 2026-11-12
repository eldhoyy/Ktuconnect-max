"use client";
import { useEffect, useState } from "react";
import { ArrowRight, Flag, X } from "lucide-react";
export function GoalBar(){
 const [open,setOpen]=useState(false),[hours,setHours]=useState("7"),[saved,setSaved]=useState(false);
 useEffect(()=>{const value=localStorage.getItem("cohertx-weekly-goal-hours");if(value)setHours(value);},[]);
 function save(){const n=Number(hours);if(!Number.isFinite(n)||n<1||n>80)return;localStorage.setItem("cohertx-weekly-goal-hours",String(n));setSaved(true);setOpen(false);}
 return <><button type="button" className="goal-bar goal-trigger" onClick={()=>{setSaved(false);setOpen(true);}}><span className="goal-icon"><Flag size={22}/></span><span className="goal-label">{saved?"Weekly goal saved": "Set your weekly study goal"}</span><ArrowRight className="goal-arrow" size={20}/></button>{open&&<div className="sheet-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false);}}><section className="settings-sheet" role="dialog" aria-modal="true" aria-label="Set weekly study goal"><div className="sheet-heading"><h2>Weekly study goal</h2><button className="header-circle" onClick={()=>setOpen(false)} aria-label="Close"><X size={21}/></button></div><p className="muted-copy">Choose how many hours you want to study this week. This goal is saved on this device.</p><label className="goal-field">Hours per week<input type="number" min="1" max="80" value={hours} onChange={e=>setHours(e.target.value)}/></label><button className="goal-save" type="button" onClick={save}>Save weekly goal</button></section></div>}</>;
}
