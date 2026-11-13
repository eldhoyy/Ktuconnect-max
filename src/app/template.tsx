"use client";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMotionPreference } from "@/components/motion-preferences";
export default function Template({ children }: { children: ReactNode }) {
 const pathname = usePathname();
 const { reduceMotion } = useMotionPreference();
 return <motion.div key={pathname} initial={reduceMotion?false:{opacity:0,y:6}} animate={{opacity:1,y:0}} transition={{duration:reduceMotion?0:.22,ease:"easeOut"}}>{children}</motion.div>;
}
