import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "../button";

describe("Button Component", () => {
  const renderComponent = () => {
    render(<Button />);
  };

  it("renders correctly", () => {
    renderComponent();

    const button = screen.getByRole("button");

    expect(button).toBeTruthy();
  });
});
