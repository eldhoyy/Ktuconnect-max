"use client";
import { useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useMotionPreference } from "@/components/motion-preferences";
import { motionSeconds, motionEase } from "@/lib/motion";

type Direction = "forward" | "back";
const stackKey = "ktu-motion-route-stack";
function routeStack(): string[] {
  try { const value = sessionStorage.getItem(stackKey); return value ? JSON.parse(value) as string[] : []; }
  catch { return []; }
}
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { reduceMotion } = useMotionPreference();
  const [direction, setDirection] = useState<Direction>("forward");
  useLayoutEffect(() => {
    const stack = routeStack();
    let nextDirection: Direction = "forward";
    if (stack.length > 1 && stack[stack.length - 2] === pathname) {
      stack.pop();
      nextDirection = "back";
    } else if (stack[stack.length - 1] !== pathname) {
      stack.push(pathname);
    }
    sessionStorage.setItem(stackKey, JSON.stringify(stack.slice(-30)));
    setDirection(nextDirection);
  }, [pathname]);
  const offset = reduceMotion ? 0 : direction === "forward" ? 8 : -8;
  return <motion.div key={pathname}
    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: offset }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: reduceMotion ? motionSeconds.fast : motionSeconds.standard, ease: motionEase.move }}>
    {children}
  </motion.div>;
}
