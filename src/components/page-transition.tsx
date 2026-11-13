"use client";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMotionPreference } from "@/components/motion-preferences";
import { motionSeconds, motionEase } from "@/lib/motion";
export function PageTransition({ children }: { children: ReactNode }) {
 const pathname=usePathname(),{reduceMotion}=useMotionPreference();
 return <AnimatePresence initial={false}>
  <motion.div key={pathname} initial={reduceMotion?{opacity:0}:{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={reduceMotion?{opacity:0}:{opacity:0,x:8}} transition={{duration:reduceMotion?motionSeconds.fast:motionSeconds.standard,ease:motionEase.move}}>
   {children}
  </motion.div>
 </AnimatePresence>;
}
