import Link from "next/link";
import {ArrowLeft,Bell,ChevronRight} from "lucide-react";
export function ScreenHeader({title,back="/"}:{title:string;back?:string}){return <header className="screen-header"><Link href={back} className="circle-button" aria-label="Go back"><ArrowLeft/></Link><h1>{title}</h1><button className="circle-button" aria-label="Notifications"><Bell/></button></header>;}
export function Leaf(){return <svg className="leaf-art" viewBox="0 0 120 100" aria-hidden="true"><path d="M60 94C20 75 8 45 18 10c28 1 48 20 42 84Z M60 94C42 48 48 18 60 4c20 22 21 54 0 90Z M60 94c-2-40 15-68 42-80 10 32-4 62-42 80Z" fill="currentColor"/></svg>;}
export function SectionTitle({children,action,href="/subjects"}:{children:React.ReactNode;action?:string;href?:string}){return <div className="section-title"><h2>{children}</h2>{action&&<Link href={href}>{action}<ChevronRight size={15}/></Link>}</div>;}
