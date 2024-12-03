import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "../input";

describe("Input Component", () => {
  it("renders correctly with default props", () => {
    render(<Input />);

    const input = screen.getByRole("textbox"); // Default role for <input>

    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("flex h-9 w-full rounded-md");
  });

  it("applies custom class names", () => {
    const customClass = "custom-class";

    render(<Input className={customClass} />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass(customClass);
  });

  it("forwards a ref", () => {
    const ref = React.createRef<HTMLInputElement>();

    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("passes additional props correctly", () => {
    render(<Input id="test-id" data-testid="input-test" />);

    const input = screen.getByTestId("input-test");

    expect(input).toHaveAttribute("id", "test-id");
  });

  it("handles `type` and placeholder props", () => {
    render(<Input type="email" placeholder="Enter your email" />);

    const input = screen.getByPlaceholderText("Enter your email");

    expect(input).toHaveAttribute("type", "email");
  });

  it("renders as disabled when `disabled` prop is passed", async () => {
    render(<Input disabled />);

    const input = screen.getByRole("textbox");

    expect(input).toBeDisabled();

    await userEvent.type(input, "text");

    expect(input).toHaveValue(""); // Disabled input shouldn't change value
  });
});
