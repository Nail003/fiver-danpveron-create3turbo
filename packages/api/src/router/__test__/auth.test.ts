import { beforeEach, describe, expect, it, vi } from "vitest";

import { invalidateSessionToken } from "@acme/auth";

import { authRouter } from "../auth"; // Adjust the import path as needed

vi.mock("@acme/auth", () => ({
  invalidateSessionToken: vi.fn(),
}));

vi.mock("../../trpc", () => ({
  publicProcedure: {
    query: vi.fn((resolver) => ({
      resolve: (args: any) => resolver(args),
    })),
  },
  protectedProcedure: {
    query: vi.fn((resolver) => ({
      resolve: (args: any) => resolver(args),
    })),
    mutation: vi.fn((resolver) => ({
      resolve: (args: any) => resolver(args),
    })),
  },
}));

describe("authRouter Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getSession", () => {
    it("returns the session from context", async () => {
      const mockContext = {
        session: { user: { id: "123", name: "Test User" } },
      };

      // Make request
      const result = await authRouter.getSession.resolve({ ctx: mockContext });

      // Session from context is returned
      expect(result).toEqual(mockContext.session);
    });
  });

  describe("getSecretMessage", () => {
    it("returns the secret message", async () => {
      // Make request
      const result = await authRouter.getSecretMessage.resolve({ ctx: {} });

      // Check whethere the secret message is returned
      expect(result).toBe("you can see this secret message!");
    });
  });

  describe("signOut", () => {
    it("returns success and invalidate current token when token is valid", async () => {
      const mockContext = { token: "valid_token" };
      const mockOpts = { ctx: mockContext };

      // Make request
      const result = await authRouter.signOut.resolve(mockOpts);

      // Make sure the current token is invalidated
      expect(invalidateSessionToken).toHaveBeenCalledWith("valid_token");
      // Should return success
      expect(result).toEqual({ success: true });
    });

    it("returns failure and does not invalidate token when token is missing", async () => {
      const mockContext = { token: null };
      const mockOpts = { ctx: mockContext };

      // Make request
      const result = await authRouter.signOut.resolve(mockOpts);

      // No need to invalidate an already invalid token
      expect(invalidateSessionToken).not.toHaveBeenCalled();
      // Should return false success
      expect(result).toEqual({ success: false });
    });
  });
});
