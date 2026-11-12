import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
const jakarta = Plus_Jakarta_Sans({ subsets:["latin"], weight:["500","600","700"], variable:"--font-jakarta", display:"swap" });
export const metadata:Metadata={title:{default:"Datum · KTU student platform",template:"%s · Datum"},description:"KTU learning resources and exam planning in one place.",applicationName:"Datum",manifest:"/manifest.webmanifest",icons:{icon:"/favicon.svg"},openGraph:{title:"Datum",description:"KTU learning and exam planning.",type:"website",images:["/og-image.svg"]}};
export const viewport:Viewport={themeColor:[{media:"(prefers-color-scheme: light)",color:"#F4F5FA"},{media:"(prefers-color-scheme: dark)",color:"#121118"}],colorScheme:"light dark"};
const themeScript="(function(){try{var v=localStorage.getItem('datum-theme');var t=v==='light'||v==='dark'?v:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();";
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body className={jakarta.variable}><AppShell>{children}</AppShell></body></html>;}
