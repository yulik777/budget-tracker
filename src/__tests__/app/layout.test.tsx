import RootLayout, { metadata } from "@/app/layout";
import { render, screen } from "@testing-library/react";

jest.mock("next/font/google", () => ({
  Playfair_Display: () => ({
    variable: "mock-playfair",
  }),
  DM_Sans: () => ({
    variable: "mock-dm-sans",
  }),
}));

describe("RootLayout", () => {
  it("renders children correctly", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });
});

describe("metadata", () => {
  it("has correct title and description", () => {
    expect(metadata.title).toBe("Budget Tracker");
    expect(metadata.description).toBe(
      "Track income and expenses — BMAD + Next.js",
    );
  });
});
