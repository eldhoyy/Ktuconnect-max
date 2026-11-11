"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, PointerEvent, ReactNode } from "react";
import { useMotionPreference } from "@/components/motion-preferences";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode };

export function MagneticLink({ href, children, className = "", onPointerMove, onPointerLeave, ...props }: Props) {
  const { reduceMotion } = useMotionPreference();

  function move(event: PointerEvent<HTMLAnchorElement>) {
    onPointerMove?.(event);
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.1;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    event.currentTarget.style.setProperty("--mag-x", `${x}px`);
    event.currentTarget.style.setProperty("--mag-y", `${y}px`);
  }

  function leave(event: PointerEvent<HTMLAnchorElement>) {
    onPointerLeave?.(event);
    event.currentTarget.style.setProperty("--mag-x", "0px");
    event.currentTarget.style.setProperty("--mag-y", "0px");
  }

  return <Link href={href} className={`magnetic-link ${className}`} onPointerMove={move} onPointerLeave={leave} {...props}>{children}</Link>;
}
