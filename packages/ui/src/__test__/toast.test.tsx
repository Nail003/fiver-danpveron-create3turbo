import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import { toast as sonnerToast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast, Toaster } from "../toast";

// Mocking external dependencies
vi.mock("next-themes", () => ({
  useTheme: vi.fn(),
}));

vi.mock("sonner", () => ({
  Toaster: vi.fn(({ children, ...props }) => (
    <div data-testid="toaster" {...props}>
      {children}
    </div>
  )),
  toast: vi.fn(),
}));

describe("Toaster Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useTheme.mockReturnValue({ theme: "light" });
  });

  it("renders the Toaster component", () => {
    render(<Toaster />);

    expect(screen.getByTestId("toaster")).toBeInTheDocument();
  });

  it("applies the correct theme based on useTheme", () => {
    useTheme.mockReturnValue({ theme: "dark" });

    render(<Toaster />);

    expect(screen.getByTestId("toaster")).toHaveAttribute("theme", "dark");
  });

  it("uses 'system' theme as default if theme is not provided", () => {
    useTheme.mockReturnValue({ theme: undefined });

    render(<Toaster />);

    expect(screen.getByTestId("toaster")).toHaveAttribute("theme", "system");
  });

  it("passes the correct toast options", () => {
    render(<Toaster />);

    expect(screen.getByTestId("toaster")).toBeInTheDocument();

    const expectedToastOptions = {
      classNames: {
        toast:
          "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
        description: "group-[.toast]:text-muted-foreground",
        actionButton:
          "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        cancelButton:
          "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
      },
    };

    expect(sonnerToast).not.toHaveBeenCalled(); // Toasting is not triggered during render

    render(<Toaster toastOptions={expectedToastOptions} />);
  });

  it("triggers a toast when the toast function is called", () => {
    const message = "Test toast message";

    toast(message);

    expect(sonnerToast).toHaveBeenCalledWith(message);
  });
});
