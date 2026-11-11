"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { Accessibility } from "lucide-react";

type MotionContextValue = { reduceMotion: boolean; toggle: () => void };
const MotionContext = createContext<MotionContextValue>({ reduceMotion: false, toggle: () => undefined });

export function MotionPreferenceProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("datum-reduce-motion") ?? localStorage.getItem("cohertx-reduce-motion");
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(stored === null ? media.matches : stored === "true");
    const onChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem("datum-reduce-motion") === null && window.localStorage.getItem("cohertx-reduce-motion") === null) setReduceMotion(event.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
  }, [reduceMotion]);

  const value = useMemo(() => ({
    reduceMotion,
    toggle: () => setReduceMotion((current) => {
      const next = !current;
      window.localStorage.setItem("datum-reduce-motion", String(next));
      return next;
    }),
  }), [reduceMotion]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotionPreference() {
  return useContext(MotionContext);
}

export function MotionPreferenceToggle() {
  const { reduceMotion, toggle } = useMotionPreference();
  return (
    <button className="motion-toggle" type="button" onClick={toggle} aria-pressed={reduceMotion}>
      <Accessibility size={15} aria-hidden="true" />
      <span>Reduce motion</span>
      <span className={reduceMotion ? "toggle-state is-on" : "toggle-state"}>{reduceMotion ? "On" : "Off"}</span>
    </button>
  );
}

export function MotionReveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { reduceMotion } = useMotionPreference();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
