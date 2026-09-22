import type { SectionColor } from "../types";

export const sectionColorClasses: Record<
  SectionColor,
  { text: string; border: string }
> = {
  emerald: { text: "text-emerald", border: "border-emerald" },
  slate: { text: "text-slate", border: "border-slate" },
  gold: { text: "text-gold", border: "border-gold" },
};
