"use client";

import { useEffect, useId, type ButtonHTMLAttributes, type HTMLAttributes, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
import { Check, ChevronDown, Moon, X } from "lucide-react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" | "danger" };
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`ui-button ui-button-${variant} ${className}`} {...props} />;
}
export function IconButton(props: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  const { label, className = "", ...rest } = props;
  return <button aria-label={label} title={label} className={`ui-icon-button ${className}`} {...rest} />;
}
export function Card({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`ui-card ${className}`} {...props}>{children}</div>;
}
export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" }) {
  return <span className={`ui-badge ui-badge-${tone}`}>{children}</span>;
}
export function Tabs({ items, value, onChange }: { items: { value: string; label: string }[]; value: string; onChange: (value: string) => void }) {
  return <div className="ui-tabs" role="tablist">{items.map(item => <button key={item.value} type="button" role="tab" aria-selected={value === item.value} className={value === item.value ? "is-active" : ""} onClick={() => onChange(item.value)}>{item.label}</button>)}</div>;
}
export function Dialog({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  const id = useId();
  useEffect(() => { if (!open) return; const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); }; window.addEventListener("keydown", close); return () => window.removeEventListener("keydown", close); }, [open, onClose]);
  if (!open) return null;
  return <div className="ui-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="ui-dialog" role="dialog" aria-modal="true" aria-labelledby={id}><header><h2 id={id}>{title}</h2><IconButton label="Close dialog" onClick={onClose}><X size={17}/></IconButton></header>{children}</section></div>;
}
export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return <div className="ui-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><aside className="ui-sheet" role="dialog" aria-modal="true"><header><h2>{title}</h2><IconButton label="Close sheet" onClick={onClose}><X size={17}/></IconButton></header>{children}</aside></div>;
}
export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return <span className="ui-tooltip" data-tooltip={label}>{children}</span>;
}
export function Input({ label, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const generated = useId();
  return <label className="ui-field" htmlFor={id ?? generated}><span>{label}</span><input id={id ?? generated} {...props}/></label>;
}
export function Select({ label, children, id, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const generated = useId();
  return <label className="ui-field" htmlFor={id ?? generated}><span>{label}</span><span className="ui-select-wrap"><select id={id ?? generated} {...props}>{children}</select><ChevronDown size={15}/></span></label>;
}
export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return <div className="ui-toast" role="status"><Check size={16}/><span>{message}</span><IconButton label="Dismiss notification" onClick={onDismiss}><X size={15}/></IconButton></div>;
}
export function Skeleton({ width = "100%", height = 16 }: { width?: string | number; height?: number }) {
  return <span className="ui-skeleton" style={{ width, height }} aria-hidden="true"/>;
}
export function ProgressRing({ value, size = 64, label }: { value: number; size?: number; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  const radius = 21;
  const circumference = 2 * Math.PI * radius;
  return <svg className="ui-progress-ring" width={size} height={size} viewBox="0 0 52 52" role="img" aria-label={label ?? `${safe}% complete`}><circle cx="26" cy="26" r={radius} fill="none" stroke="var(--line)" strokeWidth="5"/><circle cx="26" cy="26" r={radius} fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - safe / 100)} transform="rotate(-90 26 26)"/><text x="26" y="29" textAnchor="middle" fontSize="10" fill="currentColor">{Math.round(safe)}%</text></svg>;
}
export function Heatmap({ values, label = "Activity" }: { values: number[]; label?: string }) {
  return <div className="ui-heatmap" role="img" aria-label={label}>{values.map((value, index) => <span key={index} data-level={Math.max(0, Math.min(4, Math.ceil(value)))} title={`${value} activity`}/>)}</div>;
}
export function Timeline({ items }: { items: { title: string; detail?: string; status?: "done" | "current" | "upcoming" }[] }) {
  return <ol className="ui-timeline">{items.map((item, index) => <li key={index} data-status={item.status ?? "upcoming"}><span className="ui-timeline-mark"/><div><strong>{item.title}</strong>{item.detail && <p>{item.detail}</p>}</div></li>)}</ol>;
}
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="ui-empty"><span className="ui-empty-mark">—</span><h3>{title}</h3><p>{description}</p>{action}</div>;
}
export function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("cohertx-theme");
    if (saved === "dark" || saved === "light") document.documentElement.dataset.theme = saved;
  }, []);
  return null;
}
export function ThemeToggle() {
  function toggle() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("cohertx-theme", next);
  }
  return <Button variant="quiet" onClick={toggle} aria-label="Toggle colour theme"><Moon size={16}/></Button>;
}
export function CommandPalette({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  return <Dialog open={open} onClose={onClose} title="Quick search">{children}</Dialog>;
}
