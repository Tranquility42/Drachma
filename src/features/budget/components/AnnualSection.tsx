"use client";

import type { AnnualEntry } from "../types";
import {
  annualMonthlyEquivalent,
  annualTotal,
  formatCurrency,
} from "../calculations";
import { EntryRow } from "./EntryRow";

type AnnualSectionProps = {
  entries: AnnualEntry[];
  onAdd: () => void;
  onLabelChange: (entryId: string, label: string) => void;
  onAmountChange: (entryId: string, amount: number) => void;
  onDateChange: (entryId: string, dueDate: string) => void;
  onCommit: (entryId: string) => void;
  onDelete: (entryId: string) => void;
};

export function AnnualSection({
  entries,
  onAdd,
  onLabelChange,
  onAmountChange,
  onDateChange,
  onCommit,
  onDelete,
}: AnnualSectionProps) {
  return (
    <section className="mb-6">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-[1.02rem] font-semibold">Annuel</h2>
        <div className="font-mono text-[0.95rem] font-semibold text-emerald">
          {formatCurrency(annualTotal(entries))}
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
              Échéance
            </th>
            <th className="border-b border-line" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <EntryRow
              key={entry.id}
              label={entry.label}
              amount={entry.amount}
              dateLabel={entry.dueDate}
              datePlaceholder="jj/mm"
              onLabelChange={(v) => onLabelChange(entry.id, v)}
              onAmountChange={(v) => onAmountChange(entry.id, v)}
              onDateChange={(v) => onDateChange(entry.id, v)}
              onLabelCommit={() => onCommit(entry.id)}
              onAmountCommit={() => onCommit(entry.id)}
              onDateCommit={() => onCommit(entry.id)}
              onDelete={() => onDelete(entry.id)}
            />
          ))}
        </tbody>
      </table>

      <button
        type="button"
        onClick={onAdd}
        className="mt-2 w-full rounded-sm border border-dashed border-line px-2.5 py-2 text-left font-mono text-xs text-muted hover:border-muted hover:text-ink"
      >
        + ajouter une entrée annuelle
      </button>
      <div className="mt-1.5 font-mono text-[0.7rem] text-muted">
        équivalent mensuel : {formatCurrency(annualMonthlyEquivalent(entries))}
      </div>
    </section>
  );
}
