import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthShowcase } from "../auth-showcase";

// Mock the `auth`, `signIn`, and `signOut` functions
vi.mock("@acme/auth", () => ({
  auth: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

const { auth, signIn, signOut } = await import("@acme/auth");

describe("AuthShowcase", () => {
  it("renders", async () => {
    auth.mockResolvedValue(null);

    render(await AuthShowcase());

    // Check if the sign-in button is displayed
    const signInButton = screen.getByRole("button", {
      name: /sign in with discord/i,
    });
    expect(signInButton).toBeInTheDocument();
  });

  // it("renders sign-in button when no session is active", async () => {
  //   auth.mockResolvedValue(null);

  //   render(await AuthShowcase());

  //   // Check if the sign-in button is displayed
  //   const signInButton = screen.getByRole("button", {
  //     name: /sign in with discord/i,
  //   });
  //   expect(signInButton).toBeInTheDocument();

  //   // Simulate clicking the sign-in button
  //   await userEvent.click(signInButton);
  //   expect(signIn).toHaveBeenCalledWith("discord");
  // });

  // it("renders logged-in view when a session exists", async () => {
  //   auth.mockResolvedValue({
  //     user: { name: "John Doe" },
  //   });

  //   render(await AuthShowcase());

  //   // Check if the logged-in view is displayed
  //   expect(screen.getByText(/logged in as john doe/i)).toBeInTheDocument();

  //   // Check if the sign-out button is displayed
  //   const signOutButton = screen.getByRole("button", { name: /sign out/i });
  //   expect(signOutButton).toBeInTheDocument();

  //   // Simulate clicking the sign-out button
  //   await userEvent.click(signOutButton);
  //   expect(signOut).toHaveBeenCalled();
  // });

  // it("handles server-side errors gracefully", async () => {
  //   // Simulate an error in the `auth` function
  //   auth.mockRejectedValue(new Error("Server error"));

  //   render(await AuthShowcase());

  //   // Ensure the component renders nothing (or handles the error state as appropriate)
  //   expect(screen.queryByRole("button")).not.toBeInTheDocument();
  // });
});
