import { z } from "zod";

export const SECTION_COLORS = ["emerald", "slate", "gold"] as const;
export type SectionColor = (typeof SECTION_COLORS)[number];

export type Entry = {
  id: string;
  label: string;
  amount: number;
  dueDay: string;
  position: number;
};

export type Section = {
  id: string;
  title: string;
  color: SectionColor;
  entries: Entry[];
};

export type AnnualEntry = {
  id: string;
  label: string;
  amount: number;
  dueDate: string;
  position: number;
};

export const entryInputSchema = z.object({
  label: z.string().trim().max(120).default(""),
  amount: z.coerce.number().finite().default(0),
  dueDay: z.string().trim().max(20).default(""),
});

export const annualEntryInputSchema = z.object({
  label: z.string().trim().max(120).default(""),
  amount: z.coerce.number().finite().default(0),
  dueDate: z.string().trim().max(20).default(""),
});

export const sectionTitleSchema = z.string().trim().min(1).max(80);
