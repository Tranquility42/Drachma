import { formatCurrency } from "../calculations";

export function GrandTotal({ total }: { total: number }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-sm border border-brick bg-brick-soft px-4 py-3.5">
      <div className="text-[0.95rem] text-muted">
        Total mensuel (fixe + crédit + autres)
      </div>
      <div className="font-mono text-[1.7rem] font-semibold text-brick">
        {formatCurrency(total)}
      </div>
    </div>
  );
}
