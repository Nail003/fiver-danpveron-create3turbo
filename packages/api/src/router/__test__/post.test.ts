import { beforeEach, describe, expect, it, vi } from "vitest";

import { desc, eq } from "@acme/db";
import { Post } from "@acme/db/schema";

import { postRouter } from "../post";

// Mock external dependencies
vi.mock("../../trpc", () => ({
  publicProcedure: {
    query: vi.fn((resolver) => ({
      resolve: (args: any) => resolver(args),
    })),
    input: vi.fn((_input) => ({
      query: vi.fn((resolver) => ({
        resolve: (args: any) => resolver(args),
      })),
    })),
  },
  protectedProcedure: {
    mutation: vi.fn((resolver) => ({
      resolve: (args: any) => resolver(args),
    })),
    input: vi.fn((_input) => ({
      mutation: vi.fn((resolver) => ({
        resolve: (args: any) => resolver(args),
      })),
    })),
  },
}));

vi.mock("@acme/db/schema", () => ({
  CreatePostSchema: { schemaID: "schemaID" },
  Post: { id: "id" },
}));

vi.mock("@acme/db", () => ({
  desc: vi.fn((postID) => ({ column: postID, direction: "desc" })),
  eq: vi.fn((postID, inputID) => ({
    column: postID,
    value: inputID,
  })),
}));

describe("postRouter Tests", () => {
  // Mock database
  const mockDb = {
    query: {
      Post: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
    insert: vi.fn(),
    delete: vi.fn(),
  };

  // Mock context
  const createMockCtx = (overrides = {}) => ({
    db: mockDb,
    session: null,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("all", () => {
    it("fetches all posts with a limit of 10", async () => {
      const mockedPosts = [
        { id: "1", title: "First Post" },
        { id: "2", title: "Second Post" },
      ];
      mockDb.query.Post.findMany.mockResolvedValue(mockedPosts);

      // Make request
      const result = await postRouter.all.resolve({
        ctx: createMockCtx(),
        input: undefined,
      });

      // Check all the mockedPosts are fetched
      expect(result).toEqual(mockedPosts);

      // Check the post limit is set to 10 and is fetched in desending order
      expect(mockDb.query.Post.findMany).toHaveBeenCalledWith({
        orderBy: desc(Post.id),
        limit: 10,
      });
    });
  });

  describe("byId", () => {
    it("fetches a post by ID", async () => {
      const mockedPost = { id: "1", title: "First Post" };
      const input = { id: "1" };

      mockDb.query.Post.findFirst.mockResolvedValue(mockedPost);

      // Make request
      const result = await postRouter.byId.resolve({
        ctx: createMockCtx(),
        input,
      });

      // Check the mocked post is fetched
      expect(result).toEqual(mockedPost);

      // Should look for the post where post id and input id is equal
      expect(mockDb.query.Post.findFirst).toHaveBeenCalledWith({
        where: eq(Post.id, input.id),
      });
    });
  });

  describe("create", () => {
    it("creates a new post when authenticated", async () => {
      const newPost = { id: "3", title: "New Post", content: "Content" };

      const mockValuesCall = vi.fn((input) => input);
      mockDb.insert.mockImplementation((_post) => ({
        values: mockValuesCall,
      }));

      // Makes request
      const result = await postRouter.create.resolve({
        ctx: createMockCtx({ session: { user: { id: "user1" } } }),
        input: newPost,
      });

      // Make sure correct post is created
      expect(result).toEqual(newPost);

      // Check whether qurie arguments are correct
      expect(mockDb.insert).toHaveBeenCalledWith(Post);
      expect(mockValuesCall).toHaveBeenCalledWith(newPost);
    });
  });

  describe("delete", () => {
    it("deletes a post when authenticated", async () => {
      const successMessage = { success: true };
      const input = "1";

      const mockWhereCall = vi.fn((_input) => successMessage);
      mockDb.delete.mockImplementation((_post) => ({ where: mockWhereCall }));

      // Make request
      const result = await postRouter.delete.resolve({
        ctx: createMockCtx({ session: { user: { id: "user1" } } }),
        input,
      });

      // Returns successMessage on deletion
      expect(result).toEqual(successMessage);

      // Check whether qurie arguments are correct
      expect(mockDb.delete).toHaveBeenCalledWith(Post);
      expect(mockWhereCall).toHaveBeenCalledWith(eq(Post.id, input));
    });
  });
});
