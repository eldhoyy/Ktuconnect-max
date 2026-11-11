import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionPreferenceToggle } from "@/components/motion-preferences";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link href="/" className="brand"><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M5 5h9v9H5zM18 5h9v22h-9zM5 18h9v9H5z" fill="currentColor"/></svg></span><span>cohertx<span className="brand-period">.</span></span></Link>
          <p>A quieter place to learn, plan and keep track of your KTU semester.</p>
        </div>
        <div className="footer-links"><span className="footer-label">PLATFORM</span><Link href="/about">About Cohertx</Link><Link href="/sources">Sources & verification</Link><a href="https://github.com/eldhoyy/Ktuconnect-max/issues" target="_blank" rel="noreferrer">Report an issue <ArrowUpRight size={12}/></a></div>
        <div className="footer-controls"><span className="footer-label">PREFERENCES</span><MotionPreferenceToggle/><p>Motion can be reduced at any time. Your preference stays on this device.</p></div>
      </div>
      <div className="footer-policy"><p><strong>Verification policy.</strong> Only source-reviewed timetable records are presented as approved. Dates entered by students must be labelled unverified and checked against the original notice.</p><p><strong>Current limitations.</strong> The homepage preview uses a clearly labelled S5 Mechanical sample from the November 2026 timetable. Resource search and personalised progress are not connected yet.</p></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Cohertx</span><span>Built around the KTU student journey.</span></div>
    </footer>
  );
}
