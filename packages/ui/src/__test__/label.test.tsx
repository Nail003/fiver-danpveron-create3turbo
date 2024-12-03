import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Label } from "../label";

describe("Label Component", () => {
  it("renders correctly with default styles", () => {
    render(<Label htmlFor="input-id">Label Text</Label>);

    const label = screen.getByText("Label Text");

    expect(label).toBeInTheDocument();
    expect(label).toHaveClass("text-sm font-medium leading-none");
  });

  it("applies custom class names", () => {
    render(
      <Label htmlFor="input-id" className="custom-class">
        Custom Label
      </Label>,
    );

    const label = screen.getByText("Custom Label");

    expect(label).toHaveClass("custom-class");
  });

  it("applies `peer-disabled` styles when paired with a disabled input", () => {
    render(
      <>
        <Label htmlFor="input-id">Disabled Input Label</Label>

        <input id="input-id" className="peer" disabled />
      </>,
    );

    const label = screen.getByText("Disabled Input Label");

    expect(label).toHaveClass(
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    );
  });

  it("forwards ref correctly", () => {
    const ref = { current: null } as React.RefObject<HTMLLabelElement>;

    render(
      <Label ref={ref} htmlFor="input-id">
        Ref Test Label
      </Label>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName).toBe("LABEL");
  });
});
