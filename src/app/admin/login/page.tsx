"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Eye, EyeOff } from "lucide-react";
export default function AdminLoginPage(){
 const router=useRouter(),[username,setUsername]=useState(""),[password,setPassword]=useState(""),[show,setShow]=useState(false),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");try{const r=await fetch("/api/admin/login",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email:username,password})});const data=await r.json();if(!r.ok)throw new Error(data.error||"Login failed.");router.replace("/admin");}catch(err){setError(err instanceof Error?err.message:"Login failed.");}finally{setBusy(false);}}
 return <main className="screen page-enter"><section className="surface-card admin-login"><span className="task-icon"><LockKeyhole size={24}/></span><h1>Admin sign in</h1><p className="muted-copy">Protected Cohertx content management.</p><form onSubmit={submit} className="admin-form"><label>Username<input autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} required/></label><label>Password<span className="password-field"><input autoComplete="current-password" type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required/><button type="button" onClick={()=>setShow(v=>!v)} aria-label={show?"Hide password":"Show password"}>{show?<EyeOff size={18}/>:<Eye size={18}/>}</button></span></label>{error&&<p role="alert" className="admin-error">{error}</p>}<button className="goal-save" disabled={busy}>{busy?"Signing in…":"Sign in"}</button></form></section></main>;
}
