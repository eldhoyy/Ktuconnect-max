import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionPreferenceToggle } from "@/components/motion-preferences";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-top"><Link href="/" className="footer-wordmark">datum<span>.</span></Link><p>A focused KTU study desk. Built around verified dates and work you actually do.</p></div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} DATUM</span>
      <nav aria-label="Footer links"><Link href="/about">About</Link><Link href="/sources">Sources & verification</Link><a href="https://github.com/eldhoyy/Ktuconnect-max/issues" target="_blank" rel="noreferrer">Report an issue <ArrowUpRight size={12}/></a></nav>
      <MotionPreferenceToggle/>
    </div>
    <p className="footer-policy">Timetable dates link to source documents. Student-entered dates must remain labelled unverified. The homepage study card is sample content; personal progress appears only after real sessions are recorded.</p>
  </footer>;
}
