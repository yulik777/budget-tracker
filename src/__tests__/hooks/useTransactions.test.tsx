import { useTransactions } from "@/hooks/useTransactions";
import { renderHook, act } from "@testing-library/react";

type TransactionInput = {
  amount: number;
  type: "income" | "expense";
  date: string;
  category: string;
  description: string;
};

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

beforeAll(() => {
  Object.defineProperty(global, "crypto", {
    value: {
      randomUUID: () => "test-id",
    },
  });
});

describe("useTransactions", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("initializes with empty state", () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions).toEqual([]);
  });

  it("adds transaction", () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.addTransaction({
        amount: 100,
        type: "income",
        date: new Date().toISOString(),
        category: "salary",
        description: "test",
      } satisfies TransactionInput);
    });

    expect(result.current.transactions.length).toBe(1);
    expect(result.current.transactions[0].id).toBe("test-id");
  });

  it("deletes transaction", () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.addTransaction({
        amount: 100,
        type: "income",
        date: new Date().toISOString(),
        category: "salary",
        description: "test",
      } satisfies TransactionInput);
    });

    const id = result.current.transactions[0].id;

    act(() => {
      result.current.deleteTransaction(id);
    });

    expect(result.current.transactions.length).toBe(0);
  });

  it("edits transaction", () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.addTransaction({
        amount: 100,
        type: "income",
        date: new Date().toISOString(),
        category: "salary",
        description: "test",
      } satisfies TransactionInput);
    });

    const id = result.current.transactions[0].id;

    act(() => {
      result.current.editTransaction(id, { amount: 500 });
    });

    expect(result.current.transactions[0].amount).toBe(500);
  });

  it("calculates balance correctly", () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.addTransaction({
        amount: 200,
        type: "income",
        date: new Date().toISOString(),
        category: "salary",
        description: "test",
      } satisfies TransactionInput);

      result.current.addTransaction({
        amount: 50,
        type: "expense",
        date: new Date().toISOString(),
        category: "food",
        description: "test",
      } satisfies TransactionInput);
    });

    expect(result.current.balance.income).toBe(200);
    expect(result.current.balance.expense).toBe(50);
    expect(result.current.balance.net).toBe(150);
  });

  it("filters transactions by month and year", () => {
    const { result } = renderHook(() => useTransactions());

    const now = new Date();

    act(() => {
      result.current.addTransaction({
        amount: 100,
        type: "income",
        date: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
        category: "salary",
        description: "test",
      } satisfies TransactionInput);

      result.current.addTransaction({
        amount: 999,
        type: "income",
        date: new Date(2000, 1, 1).toISOString(),
        category: "old",
        description: "test",
      } satisfies TransactionInput);
    });

    expect(result.current.filteredTransactions.length).toBe(1);
  });
});
