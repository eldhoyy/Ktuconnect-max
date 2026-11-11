import { ComingSoonPage } from "@/components/coming-soon-page";
export default async function SubjectPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <ComingSoonPage title={code.toUpperCase()} description="The connected subject page—with syllabus modules, approved notes, previous papers, evidence-backed topics and exam details—is scheduled for Stage 3." stage="STAGE 3" destination="/sources" action="Review current sources"/>;
}
