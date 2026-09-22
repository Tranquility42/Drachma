type AmountLike = { amount: number };

export function sectionSum(entries: AmountLike[]): number {
  return entries.reduce((sum, entry) => sum + (Number(entry.amount) || 0), 0);
}

export function grandTotal(sections: { entries: AmountLike[] }[]): number {
  return sections.reduce((sum, section) => sum + sectionSum(section.entries), 0);
}

export function annualTotal(entries: AmountLike[]): number {
  return sectionSum(entries);
}

export function annualMonthlyEquivalent(entries: AmountLike[]): number {
  return annualTotal(entries) / 12;
}

export function formatCurrency(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `${value.toLocaleString("fr-CA", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} $`;
}
