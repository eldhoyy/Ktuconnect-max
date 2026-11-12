import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
const jakarta=Plus_Jakarta_Sans({subsets:["latin"],weight:["500","600","700"],variable:"--font-jakarta",display:"swap"});
export const metadata:Metadata={title:{default:"Cohertx — KTU student workspace",template:"%s · Cohertx"},description:"A focused KTU student workspace for verified exam dates, learning resources and study planning.",applicationName:"Cohertx",manifest:"/manifest.webmanifest",icons:{icon:"/favicon.svg"}};
export const viewport:Viewport={themeColor:[{media:"(prefers-color-scheme: light)",color:"#F4F5FA"},{media:"(prefers-color-scheme: dark)",color:"#121118"}],colorScheme:"light dark"};
const themeScript=`(()=>{try{const s=localStorage.getItem("datum-theme")||localStorage.getItem("cohertx-theme");const d=matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.dataset.theme=s==="light"||s==="dark"?s:d?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}})();`;
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body className={jakarta.variable}><AppShell>{children}</AppShell></body></html>}
