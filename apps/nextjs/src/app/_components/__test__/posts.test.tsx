import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { toast } from "@acme/ui/toast";

import { api } from "~/trpc/react";
import { CreatePostForm, PostCard, PostCardSkeleton, PostList } from "../posts";

// mocking dependencies
vi.mock("~/trpc/react", () => ({
  api: {
    post: {
      create: { useMutation: vi.fn() },
      delete: { useMutation: vi.fn() },
      all: { useSuspenseQuery: vi.fn() },
    },
    useUtils: vi.fn(),
  },
}));

// mocking components
vi.mock("@acme/ui/toast", () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe("CreatePostForm Component", () => {
  const mockMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    api.useUtils.mockReturnValue({ post: { invalidate: vi.fn() } });
    api.post.create.useMutation.mockReturnValue({
      mutate: mockMutate,
      onSuccess: vi.fn(),
      onError: vi.fn(),
    });
  });

  it("renders the form", () => {
    render(<CreatePostForm />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Content")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("sends correct data to api on form submission", async () => {
    const user = userEvent.setup();

    render(<CreatePostForm />);

    const titleInput = screen.getByPlaceholderText("Title");
    const contentInput = screen.getByPlaceholderText("Content");
    const createButton = screen.getByRole("button");

    // Simulate user input
    await user.type(titleInput, "Test Title");
    await user.type(contentInput, "Test Content");
    await user.click(createButton);

    // Api has been called with correct inputs
    expect(mockMutate).toHaveBeenCalledWith({
      title: "Test Title",
      content: "Test Content",
    });
  });

  // ------------------------------

  describe("PostList Component", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("renders no posts message when list is empty", () => {
      api.post.all.useSuspenseQuery.mockReturnValue([[]]);

      render(<PostList />);

      expect(screen.getByText("No posts yet")).toBeInTheDocument();
    });

    it("renders a list of posts when there are posts available", () => {
      const mockPosts = [
        {
          id: "1",
          title: "Post 1",
          content: "Content 1",
          createdAt: new Date(),
          updatedAt: null,
        },
        {
          id: "2",
          title: "Post 2",
          content: "Content 2",
          createdAt: new Date(),
          updatedAt: null,
        },
      ];

      api.post.all.useSuspenseQuery.mockReturnValue([mockPosts]);

      render(<PostList />);

      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Post 2")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });
  });
});

// ------------------------------

describe("PostCard Component", () => {
  const mockDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    api.useUtils.mockReturnValue({ post: { invalidate: vi.fn() } });
    api.post.delete.useMutation.mockReturnValue({
      mutate: mockDelete,
      onError: vi.fn(),
    });
  });

  const mockPost = {
    id: "1",
    title: "Post 1",
    content: "Content 1",
    createdAt: new Date(),
    updatedAt: null,
  };

  it("renders a post with delete button", () => {
    render(<PostCard post={mockPost} />);

    expect(screen.getByText("Post 1")).toBeInTheDocument();
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("delete posts on delete button click", async () => {
    const user = userEvent.setup();

    render(<PostCard post={mockPost} />);
    const deleteButton = screen.getByText("Delete");

    // Simulate user click
    await user.click(deleteButton);

    // Api called with correct arguments
    expect(mockDelete).toHaveBeenCalledWith(mockPost.id);
  });
});

// ------------------------------

describe("PostCardSkeleton Component", () => {
  it("renders skeleton with animation by default", () => {
    render(<PostCardSkeleton />);

    expect(screen.getByRole("heading")).toHaveClass("animate-pulse");
    expect(screen.getByRole("paragraph")).toHaveClass("animate-pulse");
  });

  it("renders skeleton without animation when pulse is false", () => {
    render(<PostCardSkeleton pulse={false} />);

    expect(screen.getByRole("heading")).not.toHaveClass("animate-pulse");
    expect(screen.getByRole("paragraph")).not.toHaveClass("animate-pulse");
  });
});
