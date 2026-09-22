import "server-only";
import { requireUserId } from "@/lib/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AnnualEntry, Section, SectionColor } from "./types";

export async function getBudget(): Promise<{
  sections: Section[];
  annual: AnnualEntry[];
}> {
  await requireUserId();
  const supabase = createSupabaseServerClient();

  const [sectionsRes, entriesRes, annualRes] = await Promise.all([
    supabase.from("sections").select("*").order("position"),
    supabase.from("entries").select("*").order("position"),
    supabase.from("annual_entries").select("*").order("position"),
  ]);

  if (sectionsRes.error) throw sectionsRes.error;
  if (entriesRes.error) throw entriesRes.error;
  if (annualRes.error) throw annualRes.error;

  const entries = entriesRes.data ?? [];

  const sections: Section[] = (sectionsRes.data ?? []).map((section) => ({
    id: section.id,
    title: section.title,
    color: (section.color as SectionColor) ?? "emerald",
    entries: entries
      .filter((entry) => entry.section_id === section.id)
      .map((entry) => ({
        id: entry.id,
        label: entry.label,
        amount: Number(entry.amount),
        dueDay: entry.due_day,
        position: entry.position,
      })),
  }));

  const annual: AnnualEntry[] = (annualRes.data ?? []).map((entry) => ({
    id: entry.id,
    label: entry.label,
    amount: Number(entry.amount),
    dueDate: entry.due_date,
    position: entry.position,
  }));

  return { sections, annual };
}
