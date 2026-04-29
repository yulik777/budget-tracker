import { render, screen } from "@testing-library/react";
import CategoryChart from "@/components/CategoryChart";

describe("CategoryChart", () => {
  it("renders empty state when no expenses", () => {
    render(
      <CategoryChart
        transactions={[]}
        balance={{ income: 0, expense: 0, net: 0 }}
      />,
    );

    expect(screen.getByText("Expenses by Category")).toBeInTheDocument();
    expect(
      screen.getByText("No expense data for this period"),
    ).toBeInTheDocument();
  });

  it("renders grouped expenses correctly", () => {
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
        category: "food",
        date: new Date().toISOString(),
        description: "test",
      },
      {
        id: "3",
        amount: 200,
        type: "expense" as const,
        category: "transport",
        date: new Date().toISOString(),
        description: "test",
      },
    ];

    render(
      <CategoryChart
        transactions={transactions}
        balance={{ income: 0, expense: 350, net: -350 }}
      />,
    );

    expect(screen.getByText("food")).toBeInTheDocument();
    expect(screen.getByText("transport")).toBeInTheDocument();

    expect(screen.getByText("$150.00")).toBeInTheDocument();
    expect(screen.getByText("$200.00")).toBeInTheDocument();

    expect(screen.getByText("Expenses by Category")).toBeInTheDocument();
    expect(screen.getByText("Total: $350.00")).toBeInTheDocument();
  });
});
