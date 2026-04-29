import { render, screen } from "@testing-library/react";
import ExpensesPieChart from "@/components/ExpensesPieChart";

describe("ExpensesPieChart", () => {
  it("shows empty state when no expenses", () => {
    render(<ExpensesPieChart transactions={[]} />);

    expect(screen.getByText("No expense data yet")).toBeInTheDocument();
  });

  it("renders title when there is data", () => {
    const transactions = [
      {
        id: "1",
        amount: 100,
        type: "expense" as const,
        category: "food",
        date: new Date().toISOString(),
        description: "test",
      },
    ];

    render(<ExpensesPieChart transactions={transactions} />);

    expect(screen.getByText("Expense distribution")).toBeInTheDocument();
  });

  it("renders grouped categories correctly", () => {
    const transactions = [
      {
        id: "1",
        amount: 100,
        type: "expense" as const,
        category: "food",
        date: new Date().toISOString(),
        description: "test",
      },
      {
        id: "2",
        amount: 50,
        type: "expense" as const,
        category: "transport",
        date: new Date().toISOString(),
        description: "test",
      },
      {
        id: "3",
        amount: 50,
        type: "expense" as const,
        category: "food",
        date: new Date().toISOString(),
        description: "test",
      },
    ];

    render(<ExpensesPieChart transactions={transactions} />);

    expect(screen.getByText("food")).toBeInTheDocument();
    expect(screen.getByText("transport")).toBeInTheDocument();

    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });
});
