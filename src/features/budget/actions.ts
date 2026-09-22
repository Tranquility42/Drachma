"use server";

import { revalidatePath } from "next/cache";
import { requireUserId } from "@/lib/dal";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  SECTION_COLORS,
  annualEntryInputSchema,
  entryInputSchema,
  sectionTitleSchema,
} from "./types";

async function nextPosition(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  table: "sections" | "entries" | "annual_entries",
  filter: Record<string, string>,
) {
  let query = supabase.from(table).select("position").order("position", {
    ascending: false,
  }).limit(1);
  for (const [column, value] of Object.entries(filter)) {
    query = query.eq(column, value);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data?.[0]?.position ?? -1) + 1;
}

export async function createSection() {
  const userId = await requireUserId();
  const supabase = createSupabaseServerClient();

  const { count, error: countError } = await supabase
    .from("sections")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);
  if (countError) throw countError;

  const color = SECTION_COLORS[(count ?? 0) % SECTION_COLORS.length];
  const position = await nextPosition(supabase, "sections", { user_id: userId });

  const { error } = await supabase.from("sections").insert({
    user_id: userId,
    title: "Nouvelle catégorie",
    color,
    position,
  });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateSectionTitle(sectionId: string, title: string) {
  const userId = await requireUserId();
  const parsed = sectionTitleSchema.safeParse(title);
  if (!parsed.success) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("sections")
    .update({ title: parsed.data })
    .eq("id", sectionId)
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteSection(sectionId: string) {
  const userId = await requireUserId();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("sections")
    .delete()
    .eq("id", sectionId)
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/");
}

export async function createEntry(sectionId: string) {
  const userId = await requireUserId();
  const supabase = createSupabaseServerClient();
  const position = await nextPosition(supabase, "entries", {
    user_id: userId,
    section_id: sectionId,
  });

  const { error } = await supabase.from("entries").insert({
    user_id: userId,
    section_id: sectionId,
    label: "",
    amount: 0,
    due_day: "",
    position,
  });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateEntry(
  entryId: string,
  input: { label?: string; amount?: number; dueDay?: string },
) {
  const userId = await requireUserId();
  const parsed = entryInputSchema.partial().safeParse(input);
  if (!parsed.success) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("entries")
    .update({
      ...(parsed.data.label !== undefined && { label: parsed.data.label }),
      ...(parsed.data.amount !== undefined && { amount: parsed.data.amount }),
      ...(parsed.data.dueDay !== undefined && { due_day: parsed.data.dueDay }),
    })
    .eq("id", entryId)
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteEntry(entryId: string) {
  const userId = await requireUserId();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/");
}

export async function createAnnualEntry() {
  const userId = await requireUserId();
  const supabase = createSupabaseServerClient();
  const position = await nextPosition(supabase, "annual_entries", {
    user_id: userId,
  });

  const { error } = await supabase.from("annual_entries").insert({
    user_id: userId,
    label: "",
    amount: 0,
    due_date: "",
    position,
  });
  if (error) throw error;

  revalidatePath("/");
}

export async function updateAnnualEntry(
  entryId: string,
  input: { label?: string; amount?: number; dueDate?: string },
) {
  const userId = await requireUserId();
  const parsed = annualEntryInputSchema.partial().safeParse(input);
  if (!parsed.success) return;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("annual_entries")
    .update({
      ...(parsed.data.label !== undefined && { label: parsed.data.label }),
      ...(parsed.data.amount !== undefined && { amount: parsed.data.amount }),
      ...(parsed.data.dueDate !== undefined && {
        due_date: parsed.data.dueDate,
      }),
    })
    .eq("id", entryId)
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/");
}

export async function deleteAnnualEntry(entryId: string) {
  const userId = await requireUserId();
  const supabase = createSupabaseServerClient();
  const { error } = await supabase
    .from("annual_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);
  if (error) throw error;

  revalidatePath("/");
}
