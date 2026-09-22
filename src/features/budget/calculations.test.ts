import { describe, expect, it } from "vitest";
import {
  annualMonthlyEquivalent,
  annualTotal,
  formatCurrency,
  grandTotal,
  sectionSum,
} from "./calculations";

describe("sectionSum", () => {
  it("sums entry amounts", () => {
    expect(sectionSum([{ amount: 10 }, { amount: 2.5 }])).toBe(12.5);
  });

  it("treats non-finite amounts as zero", () => {
    expect(sectionSum([{ amount: Number.NaN }, { amount: 5 }])).toBe(5);
  });

  it("returns 0 for an empty list", () => {
    expect(sectionSum([])).toBe(0);
  });
});

describe("grandTotal", () => {
  it("sums across sections", () => {
    const sections = [
      { entries: [{ amount: 100 }, { amount: 50 }] },
      { entries: [{ amount: 20 }] },
    ];
    expect(grandTotal(sections)).toBe(170);
  });
});

describe("annualTotal / annualMonthlyEquivalent", () => {
  it("computes the annual total and its monthly equivalent", () => {
    const entries = [{ amount: 240 }, { amount: 120 }];
    expect(annualTotal(entries)).toBe(360);
    expect(annualMonthlyEquivalent(entries)).toBe(30);
  });
});

describe("formatCurrency", () => {
  it("formats using fr-CA conventions", () => {
    expect(formatCurrency(1234.5)).toContain("$");
  });

  it("falls back to 0 for non-finite input", () => {
    expect(formatCurrency(Number.NaN)).toBe(
      (0).toLocaleString("fr-CA", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }) + " $",
    );
  });
});
