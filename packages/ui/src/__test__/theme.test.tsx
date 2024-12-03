import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, useTheme } from "next-themes";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ThemeToggle } from "../theme";

// Mocking useTheme to control its behavior in tests
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("ThemeToggle Component", () => {
  const setTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useTheme.mockReturnValue({ setTheme });
  });

  it("renders the ThemeToggle component with dropdown trigger", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const triggerButton = screen.getByRole("button", { name: /toggle theme/i });

    expect(triggerButton).toBeInTheDocument();
  });

  it("displays dropdown options when the button is clicked", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const user = userEvent.setup();

    const triggerButton = screen.getByRole("button", { name: /toggle theme/i });

    // Simulate user click on toggle theme button
    await user.click(triggerButton);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("sets the light theme when the Light option is clicked", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const user = userEvent.setup();
    const triggerButton = screen.getByRole("button", { name: /toggle theme/i });

    // Simulate user click on toggle theme button
    await user.click(triggerButton);

    const lightOption = screen.getByText("Light");

    // Simulate user click on light button
    await user.click(lightOption);

    expect(setTheme).toHaveBeenCalledWith("light");
  });

  it("sets the dark theme when the Dark option is clicked", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const user = userEvent.setup();
    const triggerButton = screen.getByRole("button", { name: /toggle theme/i });

    // Simulate user click on toggle theme button
    await user.click(triggerButton);

    const darkOption = screen.getByText("Dark");

    // Simulate user click on dark button
    await user.click(darkOption);

    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("sets the system theme when the System option is clicked", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const user = userEvent.setup();
    const triggerButton = screen.getByRole("button", { name: /toggle theme/i });

    // Simulate user click on toggle theme button
    await user.click(triggerButton);

    const systemOption = screen.getByText("System");

    // Simulate user click on system button
    await user.click(systemOption);

    expect(setTheme).toHaveBeenCalledWith("system");
  });
});
