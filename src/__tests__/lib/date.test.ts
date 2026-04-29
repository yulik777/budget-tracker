import { getMonth, getYear, isSameMonth } from "@/lib/date";

describe("date utils", () => {
  it("gets month correctly", () => {
    expect(getMonth("2024-01-10")).toBe(0);
  });

  it("gets year correctly", () => {
    expect(getYear("2024-01-10")).toBe(2024);
  });

  it("checks same month correctly", () => {
    expect(isSameMonth("2024-01-10", 0, 2024)).toBe(true);
    expect(isSameMonth("2024-02-10", 0, 2024)).toBe(false);
  });
});
