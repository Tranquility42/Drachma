"use client";

type EntryRowProps = {
  label: string;
  amount: number;
  dateLabel: string;
  datePlaceholder: string;
  onLabelChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onDateChange: (value: string) => void;
  onLabelCommit: () => void;
  onAmountCommit: () => void;
  onDateCommit: () => void;
  onDelete: () => void;
};

export function EntryRow({
  label,
  amount,
  dateLabel,
  datePlaceholder,
  onLabelChange,
  onAmountChange,
  onDateChange,
  onLabelCommit,
  onAmountCommit,
  onDateCommit,
  onDelete,
}: EntryRowProps) {
  return (
    <tr className="border-b border-line">
      <td className="p-0.5 align-middle">
        <input
          className="w-full rounded-sm border-none bg-transparent px-1.5 py-2 text-[0.92rem] text-ink focus:bg-paper-2 focus:outline-none"
          type="text"
          placeholder="Poste"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          onBlur={onLabelCommit}
        />
      </td>
      <td className="p-0.5 text-right align-middle">
        <input
          className="w-full rounded-sm border-none bg-transparent px-1.5 py-2 text-right font-mono text-[0.88rem] text-ink focus:bg-paper-2 focus:outline-none"
          type="number"
          step="0.01"
          placeholder="0"
          value={Number.isFinite(amount) ? amount : 0}
          onChange={(e) => onAmountChange(e.target.valueAsNumber || 0)}
          onBlur={onAmountCommit}
        />
      </td>
      <td className="p-0.5 align-middle">
        <input
          className="w-full rounded-sm border-none bg-transparent px-1.5 py-2 font-mono text-[0.88rem] text-ink focus:bg-paper-2 focus:outline-none"
          type="text"
          placeholder={datePlaceholder}
          value={dateLabel}
          onChange={(e) => onDateChange(e.target.value)}
          onBlur={onDateCommit}
        />
      </td>
      <td className="w-6 p-0.5 text-center align-middle">
        <button
          type="button"
          title="supprimer"
          onClick={onDelete}
          className="rounded p-1.5 text-muted hover:text-brick"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
