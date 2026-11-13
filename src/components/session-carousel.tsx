"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function SessionCarousel({children}:{children:ReactNode}) {
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const element=root.current;
  if(!element)return;
  const cards=Array.from(element.querySelectorAll<HTMLElement>(".session-card"));
  if(!("IntersectionObserver" in window)){cards[0]?.setAttribute("data-snap-active","true");return;}
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries) {
    if(entry.isIntersecting && entry.intersectionRatio>=.65) entry.target.setAttribute("data-snap-active","true");
    else entry.target.removeAttribute("data-snap-active");
   }
  },{root:element,threshold:[.65,.8,1]});
  cards.forEach(card=>observer.observe(card));
  return ()=>observer.disconnect();
 },[]);
 return <div ref={root} className="session-carousel" aria-label="Upcoming exam sessions">{children}</div>;
}
