import React from "react";

import "@testing-library/jest-dom";

import { Suspense } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { api } from "~/trpc/server";
import { PostCardSkeleton, PostList } from "../_components/posts";
import HomePage from "../page";

// Mocking API calls
vi.mock("~/trpc/server", () => ({
  api: {
    post: {
      all: {
        prefetch: vi.fn(),
      },
    },
  },
  HydrateClient: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock components
vi.mock("../_components/posts", () => ({
  CreatePostForm: vi.fn(() => (
    <div data-testid="create-post-form">CreatePostForm</div>
  )),
  PostCardSkeleton: vi.fn(() => (
    <div data-testid="post-card-skeleton">PostCardSkeleton</div>
  )),
  PostList: vi.fn(() => <div data-testid="post-list">PostList</div>),
}));

vi.mock("../_components/auth-showcase", () => ({
  AuthShowcase: () => <div data-testid="auth-showcase">Auth Component</div>,
}));

describe("HomePage", () => {
  it("renders the main title", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("prefetchs all the posts", () => {
    render(<HomePage />);
    expect(api.post.all.prefetch).toHaveBeenCalled();
  });

  it("renders AuthShowcase, CreatePostForm, and PostList", () => {
    render(<HomePage />);

    // Check that AuthShowcase is rendered
    expect(screen.getByTestId("auth-showcase")).toBeInTheDocument();

    // Check that CreatePostForm is rendered
    expect(screen.getByTestId("create-post-form")).toBeInTheDocument();

    // Check that PostList is rendered inside Suspense
    expect(screen.getByTestId("post-list")).toBeInTheDocument();
  });
});
