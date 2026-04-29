import { render, screen, fireEvent } from "@testing-library/react";
import TransactionList from "@/components/TransactionList";

const transactions = [
  {
    id: "1",
    amount: 100,
    type: "income" as const,
    category: "salary",
    date: new Date().toISOString(),
    description: "work",
  },
  {
    id: "2",
    amount: 50,
    type: "expense" as const,
    category: "food",
    date: new Date().toISOString(),
    description: "lunch",
  },
];

describe("TransactionList", () => {
  it("calls onEdit when saving", () => {
    const onEdit = jest.fn();

    render(
      <TransactionList
        transactions={transactions}
        onDelete={jest.fn()}
        onEdit={onEdit}
      />,
    );

    fireEvent.click(screen.getAllByRole("button")[0]);

    fireEvent.change(screen.getByPlaceholderText("Amount"), {
      target: { value: "200" },
    });

    fireEvent.change(screen.getByPlaceholderText("Category"), {
      target: { value: "new" },
    });

    const buttons = screen.getAllByRole("button");

    const saveButton = buttons.find((btn) =>
      btn.querySelector("svg")?.classList.contains("lucide-check"),
    );

    fireEvent.click(saveButton!);

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
