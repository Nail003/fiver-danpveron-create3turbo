//@ts-nocheck
import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../button";

describe("Button Component", () => {
  it("renders with default styles", () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary text-primary-foreground");
  });

  it("applies the correct styles for the variant prop", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toHaveClass("bg-destructive text-destructive-foreground");
  });

  it("applies the correct styles for the size prop", () => {
    render(<Button size="lg">Large Button</Button>);
    const button = screen.getByRole("button", { name: /large button/i });
    expect(button).toHaveClass("h-10 rounded-md px-8");
  });

  it("supports custom className", () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const button = screen.getByRole("button", { name: /custom class button/i });
    expect(button).toHaveClass("custom-class");
  });

  it("renders a custom component when asChild is true", () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/test");
  });

  it("handles click events", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Clickable</Button>);
    const button = screen.getByRole("button", { name: /clickable/i });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("is disabled when the disabled prop is set", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass(
      "disabled:pointer-events-none disabled:opacity-50",
    );
  });

  it("supports forwarding refs", () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);
    const button = screen.getByRole("button", { name: /ref button/i });
    expect(ref).toHaveBeenCalledWith(button);
  });
});
