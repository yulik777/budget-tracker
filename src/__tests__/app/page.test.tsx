import { render, screen, fireEvent } from "@testing-library/react";
import HomePage from "@/app/page";

jest.mock("@/hooks/useTransactions", () => ({
  useTransactions: () => ({
    filteredTransactions: [],
    addTransaction: jest.fn(),
    deleteTransaction: jest.fn(),
    editTransaction: jest.fn(),
    balance: {
      net: 100,
      income: 200,
      expense: 100,
    },
    hydrated: true,
    selectedMonth: 0,
    selectedYear: 2026,
    setSelectedMonth: jest.fn(),
    setSelectedYear: jest.fn(),
  }),
}));

jest.mock("@/components/TransactionList", () => {
  const Mock = () => <div data-testid="transaction-list" />;
  Mock.displayName = "TransactionListMock";
  return Mock;
});

jest.mock("@/components/CategoryChart", () => {
  const Mock = () => <div data-testid="category-chart" />;
  Mock.displayName = "CategoryChartMock";
  return Mock;
});

jest.mock("@/components/ExpensesPieChart", () => {
  const Mock = () => <div data-testid="pie-chart" />;
  Mock.displayName = "ExpensesPieChartMock";
  return Mock;
});

jest.mock("@/components/AddTransactionForm", () => {
  type Props = {
    onClose: () => void;
    onAdd?: () => void;
  };

  const Mock = ({ onClose }: Props) => (
    <div data-testid="add-form">
      <button onClick={onClose}>close</button>
    </div>
  );

  Mock.displayName = "AddTransactionFormMock";
  return Mock;
});

describe("HomePage", () => {
  it("renders main UI correctly", () => {
    render(<HomePage />);

    expect(screen.getByText("Budget Tracker")).toBeInTheDocument();
    expect(screen.getByText("Add transaction")).toBeInTheDocument();
  });

  it("shows balance cards", () => {
    render(<HomePage />);

    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("opens and closes add transaction form", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByText("Add transaction"));
    expect(screen.getByTestId("add-form")).toBeInTheDocument();

    fireEvent.click(screen.getByText("close"));
    expect(screen.queryByTestId("add-form")).not.toBeInTheDocument();
  });

  it("switches to analytics tab", () => {
    render(<HomePage />);

    fireEvent.click(screen.getByText("Analytics"));

    expect(screen.getByTestId("category-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
  });

  it("renders transaction list by default", () => {
    render(<HomePage />);

    expect(screen.getByTestId("transaction-list")).toBeInTheDocument();
  });
});
