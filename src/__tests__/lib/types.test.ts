import { CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/lib/types";

describe("transaction types constants", () => {
  it("has income categories", () => {
    expect(INCOME_CATEGORIES).toContain("Salary");
    expect(INCOME_CATEGORIES).toContain("Freelance");
  });

  it("has expense categories", () => {
    expect(EXPENSE_CATEGORIES).toContain("Food");
    expect(EXPENSE_CATEGORIES).toContain("Transport");
  });

  it("maps categories correctly", () => {
    expect(CATEGORIES.income).toBe(INCOME_CATEGORIES);
    expect(CATEGORIES.expense).toBe(EXPENSE_CATEGORIES);
  });
});
