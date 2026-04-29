import { formatMoney } from "@/lib/format";

describe("formatMoney", () => {
  it("formats positive number", () => {
    expect(formatMoney(100)).toBe("$100");
  });

  it("formats zero", () => {
    expect(formatMoney(0)).toBe("$0");
  });

  it("formats large number", () => {
    expect(formatMoney(1234567)).toBe("$1,234,567");
  });

  it("formats negative number", () => {
    expect(formatMoney(-50)).toBe("-$50");
  });
});
