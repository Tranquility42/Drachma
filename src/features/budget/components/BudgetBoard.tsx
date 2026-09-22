"use client";

import { useState, useTransition } from "react";
import type { AnnualEntry, Section } from "../types";
import { grandTotal } from "../calculations";
import {
  createAnnualEntry,
  createEntry,
  createSection,
  deleteAnnualEntry,
  deleteEntry,
  updateAnnualEntry,
  updateEntry,
  updateSectionTitle,
} from "../actions";
import { GrandTotal } from "./GrandTotal";
import { SectionCard } from "./SectionCard";
import { AnnualSection } from "./AnnualSection";
import { Toast } from "./Toast";

type BudgetBoardProps = {
  initialSections: Section[];
  initialAnnual: AnnualEntry[];
};

export function BudgetBoard({ initialSections, initialAnnual }: BudgetBoardProps) {
  const [sections, setSections] = useState(initialSections);
  const [annual, setAnnual] = useState(initialAnnual);
  const [toast, setToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Resync local (optimistic) state whenever the server sends fresh props,
  // e.g. after revalidatePath() following a mutation. Done during render
  // (React's documented pattern for "adjusting state on prop change"),
  // not in an effect, to avoid an extra render pass.
  const [prevInitialSections, setPrevInitialSections] = useState(initialSections);
  if (initialSections !== prevInitialSections) {
    setPrevInitialSections(initialSections);
    setSections(initialSections);
  }
  const [prevInitialAnnual, setPrevInitialAnnual] = useState(initialAnnual);
  if (initialAnnual !== prevInitialAnnual) {
    setPrevInitialAnnual(initialAnnual);
    setAnnual(initialAnnual);
  }

  function flashToast(message: string) {
    setToast(message);
    setTimeout(() => setToast((current) => (current === message ? null : current)), 1400);
  }

  function runAction(action: () => Promise<void>, successMessage = "Enregistré") {
    startTransition(async () => {
      try {
        await action();
        flashToast(successMessage);
      } catch {
        flashToast("Erreur d'enregistrement");
      }
    });
  }

  function updateSectionEntry(
    sectionId: string,
    entryId: string,
    patch: Partial<{ label: string; amount: number; dueDay: string }>,
  ) {
    setSections((prev) =>
      prev.map((section) =>
        section.id !== sectionId
          ? section
          : {
              ...section,
              entries: section.entries.map((entry) =>
                entry.id !== entryId ? entry : { ...entry, ...patch },
              ),
            },
      ),
    );
  }

  function commitEntry(sectionId: string, entryId: string) {
    const section = sections.find((s) => s.id === sectionId);
    const entry = section?.entries.find((e) => e.id === entryId);
    if (!entry) return;
    runAction(() =>
      updateEntry(entryId, {
        label: entry.label,
        amount: entry.amount,
        dueDay: entry.dueDay,
      }),
    );
  }

  return (
    <div className="mx-auto max-w-[640px] px-4 pb-16 pt-7">
      <header className="mb-5 flex items-baseline justify-between border-b-2 border-ink pb-3.5">
        <h1 className="text-[1.55rem] font-semibold">Registre budgétaire</h1>
        <div className="text-right font-mono text-[0.72rem] leading-tight text-muted">
          mensuel
          <br />
          modifiable
        </div>
      </header>

      <GrandTotal total={grandTotal(sections)} />

      <div>
        {sections.map((section) => (
          <SectionCard
            key={section.id}
            section={section}
            onTitleChange={(title) =>
              setSections((prev) =>
                prev.map((s) => (s.id === section.id ? { ...s, title } : s)),
              )
            }
            onTitleCommit={() => {
              const current = sections.find((s) => s.id === section.id);
              if (current) runAction(() => updateSectionTitle(section.id, current.title));
            }}
            onAddEntry={() => runAction(() => createEntry(section.id), "Entrée ajoutée")}
            onEntryLabelChange={(entryId, label) =>
              updateSectionEntry(section.id, entryId, { label })
            }
            onEntryAmountChange={(entryId, amount) =>
              updateSectionEntry(section.id, entryId, { amount })
            }
            onEntryDateChange={(entryId, dueDay) =>
              updateSectionEntry(section.id, entryId, { dueDay })
            }
            onEntryCommit={(entryId) => commitEntry(section.id, entryId)}
            onEntryDelete={(entryId) => {
              setSections((prev) =>
                prev.map((s) =>
                  s.id !== section.id
                    ? s
                    : { ...s, entries: s.entries.filter((e) => e.id !== entryId) },
                ),
              );
              runAction(() => deleteEntry(entryId), "Entrée supprimée");
            }}
          />
        ))}
      </div>

      <AnnualSection
        entries={annual}
        onAdd={() => runAction(() => createAnnualEntry(), "Entrée ajoutée")}
        onLabelChange={(entryId, label) =>
          setAnnual((prev) => prev.map((e) => (e.id === entryId ? { ...e, label } : e)))
        }
        onAmountChange={(entryId, amount) =>
          setAnnual((prev) => prev.map((e) => (e.id === entryId ? { ...e, amount } : e)))
        }
        onDateChange={(entryId, dueDate) =>
          setAnnual((prev) => prev.map((e) => (e.id === entryId ? { ...e, dueDate } : e)))
        }
        onCommit={(entryId) => {
          const entry = annual.find((e) => e.id === entryId);
          if (!entry) return;
          runAction(() =>
            updateAnnualEntry(entryId, {
              label: entry.label,
              amount: entry.amount,
              dueDate: entry.dueDate,
            }),
          );
        }}
        onDelete={(entryId) => {
          setAnnual((prev) => prev.filter((e) => e.id !== entryId));
          runAction(() => deleteAnnualEntry(entryId), "Entrée supprimée");
        }}
      />

      <footer className="mt-2 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => runAction(() => createSection(), "Catégorie ajoutée")}
          className="rounded-sm border border-line bg-paper-2 px-3 py-2 font-mono text-xs text-muted hover:border-ink hover:text-ink"
        >
          + nouvelle catégorie
        </button>
      </footer>

      <Toast message={toast} />
    </div>
  );
}
