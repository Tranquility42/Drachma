"use client";

import type { Section } from "../types";
import { formatCurrency, sectionSum } from "../calculations";
import { sectionColorClasses } from "./colors";
import { EntryRow } from "./EntryRow";

type SectionCardProps = {
  section: Section;
  onTitleChange: (title: string) => void;
  onTitleCommit: () => void;
  onAddEntry: () => void;
  onEntryLabelChange: (entryId: string, label: string) => void;
  onEntryAmountChange: (entryId: string, amount: number) => void;
  onEntryDateChange: (entryId: string, dueDay: string) => void;
  onEntryCommit: (entryId: string) => void;
  onEntryDelete: (entryId: string) => void;
};

export function SectionCard({
  section,
  onTitleChange,
  onTitleCommit,
  onAddEntry,
  onEntryLabelChange,
  onEntryAmountChange,
  onEntryDateChange,
  onEntryCommit,
  onEntryDelete,
}: SectionCardProps) {
  const colors = sectionColorClasses[section.color];

  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            onTitleChange(e.currentTarget.textContent ?? "");
            onTitleCommit();
          }}
          className="text-[1.02rem] font-semibold outline-none"
        >
          {section.title}
        </h2>
        <div className={`font-mono text-[0.95rem] font-semibold ${colors.text}`}>
          {formatCurrency(sectionSum(section.entries))}
        </div>
      </div>

      <table className="w-full border-t border-line border-collapse">
        <thead>
          <tr>
            <th className="px-1 py-1.5 text-left font-mono text-[0.66rem] font-medium text-muted border-b border-line">
              Poste
            </th>
            <th className="px-1 py-1.5 text-right font-mono text-[0.66rem] font-medium text-muted border-b border-line">
              Montant
            </th>
            <th className="px-1 py-1.5 text-left font-mono text-[0.66rem] font-medium text-muted border-b border-line">
              Date
            </th>
            <th className="border-b border-line" />
          </tr>
        </thead>
        <tbody>
          {section.entries.map((entry) => (
            <EntryRow
              key={entry.id}
              label={entry.label}
              amount={entry.amount}
              dateLabel={entry.dueDay}
              datePlaceholder="jj"
              onLabelChange={(v) => onEntryLabelChange(entry.id, v)}
              onAmountChange={(v) => onEntryAmountChange(entry.id, v)}
              onDateChange={(v) => onEntryDateChange(entry.id, v)}
              onLabelCommit={() => onEntryCommit(entry.id)}
              onAmountCommit={() => onEntryCommit(entry.id)}
              onDateCommit={() => onEntryCommit(entry.id)}
              onDelete={() => onEntryDelete(entry.id)}
            />
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={onAddEntry}
        className="mt-2 w-full rounded-sm border border-dashed border-line px-2.5 py-2 text-left font-mono text-xs text-muted hover:border-muted hover:text-ink"
      >
        + ajouter une entrée
      </button>
    </section>
  );
}
