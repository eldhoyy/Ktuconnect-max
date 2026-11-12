import {ScheduleScreen} from "@/components/reference-ui/schedule-screen";
import {getApprovedPapers} from "@/lib/approved-timetable";
export const metadata={title:"Exam schedule"};
export default function TimetablePage(){return <ScheduleScreen papers={getApprovedPapers({branch:"Mechanical",semester:"S3",scheme:"2024"})}/>;}
