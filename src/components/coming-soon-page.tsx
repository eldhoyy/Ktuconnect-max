import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function ComingSoonPage({ title, description, stage, destination = "/", action = "Back to home" }: { title: string; description: string; stage: string; destination?: string; action?: string }) {
  return (
    <main className="editorial-page coming-soon-page">
      <header className="editorial-heading">
        <span className="section-overline">DATUM / IN PROGRESS · {stage}</span>
        <h1>{title}<br/><em>is taking shape.</em></h1>
        <p>{description}</p>
      </header>
      <section className="editorial-note">
        <span className="section-overline">BUILT IN REVIEWED STAGES</span>
        <h2>This part is not live yet.</h2>
        <p>We are keeping this route available so navigation works, but we will not show invented academic material or pretend that a feature is ready before it has been built and checked.</p>
        <Link href={destination} className="text-link"><ArrowLeft size={15}/>{action}<ArrowUpRight size={14}/></Link>
      </section>
    </main>
  );
}
