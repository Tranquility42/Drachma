import { UserButton } from "@clerk/nextjs";
import { getBudget } from "@/features/budget/queries";
import { BudgetBoard } from "@/features/budget/components/BudgetBoard";

export default async function DashboardPage() {
  const { sections, annual } = await getBudget();

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-10">
        <UserButton />
      </div>
      <BudgetBoard initialSections={sections} initialAnnual={annual} />
    </div>
  );
}
