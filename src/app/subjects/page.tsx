import {SubjectsScreen} from "@/components/reference-ui/subjects-screen";
import topics from "@/data/important-topics.json";
export const metadata={title:"Subjects"};
export default function SubjectsPage(){const subjects=Object.entries(topics).map(([code,item])=>({code,title:item.subject}));return <SubjectsScreen subjects={subjects.slice(0,4)}/>;}
