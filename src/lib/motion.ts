export const motionDuration = { fast: 120, standard: 220, slow: 400, theme: 200 } as const;
export const motionSeconds = { fast: .12, standard: .22, slow: .4, theme: .2 } as const;
export const motionEase = {
  enter: [0.16, 1, 0.3, 1] as const,
  move: [0.4, 0, 0.2, 1] as const,
};
export const motionSpring = {
  navPill: { type: "spring" as const, stiffness: 420, damping: 34, mass: .72 },
  sheet: { type: "spring" as const, stiffness: 340, damping: 34, mass: .9 },
};
export const motionStagger = .05;
export const fadeOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: motionSeconds.fast, ease: motionEase.enter },
};
export const pageTransition = {
  duration: motionSeconds.standard,
  ease: motionEase.move,
};
export const pressScale = { scale: .98 };
