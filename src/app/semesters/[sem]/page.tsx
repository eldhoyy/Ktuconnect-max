import { ComingSoonPage } from "@/components/coming-soon-page";
export default async function SemesterPage({ params }: { params: Promise<{ sem: string }> }) {
  const { sem } = await params;
  return <ComingSoonPage title={`Semester ${sem}`} description="The semester hub for subjects, resources, syllabus and notices will be built in Stage 3." stage="STAGE 3"/>;
}
