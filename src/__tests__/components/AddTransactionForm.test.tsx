import { render, screen, fireEvent } from "@testing-library/react";
import AddTransactionForm from "@/components/AddTransactionForm";

describe("AddTransactionForm", () => {
  it("renders form", () => {
    render(<AddTransactionForm onAdd={jest.fn()} onClose={jest.fn()} />);

    expect(
      screen.getByRole("heading", { name: "Add transaction" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Category")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("calls onClose when cancel clicked", () => {
    const onClose = jest.fn();

    render(<AddTransactionForm onAdd={jest.fn()} onClose={onClose} />);

    fireEvent.click(screen.getByText("Cancel"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("shows validation errors on empty submit", () => {
    render(<AddTransactionForm onAdd={jest.fn()} onClose={jest.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Add transaction" }));

    expect(screen.getByText("Enter valid amount")).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[1]).toBeInTheDocument();
  });

  it("submits valid form", () => {
    const onAdd = jest.fn();
    const onClose = jest.fn();

    render(<AddTransactionForm onAdd={onAdd} onClose={onClose} />);

    fireEvent.change(screen.getByPlaceholderText("0.00"), {
      target: { value: "100" },
    });

    fireEvent.change(screen.getByPlaceholderText("Optional note"), {
      target: { value: "test" },
    });

    fireEvent.change(screen.getByDisplayValue("Expense"), {
      target: { value: "income" },
    });

    fireEvent.change(screen.getAllByRole("combobox")[1], {
      target: { value: "Salary" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add transaction" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
