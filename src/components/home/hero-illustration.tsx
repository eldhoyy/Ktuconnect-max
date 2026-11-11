"use client";

import { motion } from "motion/react";
import { useMotionPreference } from "@/components/motion-preferences";

export function HeroIllustration() {
  const { reduceMotion } = useMotionPreference();
  const idle = reduceMotion ? {} : { y: [0, -5, 0], rotate: [0, 0.4, 0] };

  return (
    <div className="hero-art" aria-label="Notes, a question paper and a timetable coming together as a study plan" role="img">
      <div className="art-orbit art-orbit-one" />
      <div className="art-orbit art-orbit-two" />
      <motion.div className="paper-stack note-sheet" animate={idle} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <span className="sheet-label">FIELD NOTES / 01</span>
        <span className="sheet-rule wide" /><span className="sheet-rule" /><span className="sheet-rule medium" />
        <span className="sheet-highlight">Key concepts</span>
        <span className="sheet-rule wide" /><span className="sheet-rule short" />
      </motion.div>
      <motion.div className="paper-stack question-sheet" animate={reduceMotion ? {} : { y: [0, 4, 0], rotate: [3, 2.4, 3] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
        <span className="sheet-label">KTU / QUESTION PAPER</span>
        <strong>PART B</strong>
        <span className="sheet-rule wide" /><span className="sheet-rule medium" />
        <span className="question-number">01.</span><span className="sheet-rule wide" /><span className="sheet-rule" />
        <span className="question-number">02.</span><span className="sheet-rule medium" />
      </motion.div>
      <motion.div className="paper-stack timetable-sheet" animate={reduceMotion ? {} : { y: [0, -3, 0], rotate: [-4, -3.3, -4] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}>
        <span className="sheet-label">EXAM TIMETABLE</span>
        <div className="mini-date"><b>23</b><span>NOV<br />2026</span></div>
        <span className="sheet-rule wide" /><span className="sheet-rule medium" /><span className="sheet-rule short" />
      </motion.div>
      <motion.div className="assembled-plan" initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.75, delay: 0.2 }}>
        <div className="plan-topline"><span className="plan-dot" /> YOUR STUDY PLAN <span>01—03</span></div>
        <strong>Make the next<br />session count.</strong>
        <div className="plan-task"><span className="task-check">✓</span><span>Review lecture notes</span><small>25 min</small></div>
        <div className="plan-task"><span className="task-check">✓</span><span>Attempt a past paper</span><small>40 min</small></div>
        <div className="plan-progress"><span /></div>
        <small className="plan-caption">A clearer path from material to momentum.</small>
      </motion.div>
      <span className="art-coordinate coordinate-top">11° 41' N / 76° 00' E</span>
      <span className="art-coordinate coordinate-bottom">STUDY SYSTEM / FIG. 01</span>
    </div>
  );
}
