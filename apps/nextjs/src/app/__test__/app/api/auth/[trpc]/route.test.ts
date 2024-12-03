import { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { appRouter } from "@acme/api";

import { GET, OPTIONS, POST } from "~/app/api/trpc/[trpc]/route";

// Mock dependencies
vi.mock("@trpc/server/adapters/fetch", () => ({
  fetchRequestHandler: vi.fn(),
}));

vi.mock("@acme/api", () => ({
  appRouter: {},
  createTRPCContext: vi.fn(),
}));

vi.mock("@acme/auth", () => ({
  auth: vi.fn((handler) => handler),
}));

describe("[trpc] API Route Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock external dependencies
    const mockFetchHandler = vi.fn(
      async () => new Response("OK", { status: 200 }),
    );
    fetchRequestHandler.mockImplementationOnce(mockFetchHandler);
  });

  describe("OPTIONS Handler", () => {
    it("returns 204 with appropriate CORS headers", async () => {
      const response = OPTIONS();

      expect(response.status).toBe(204);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
      expect(response.headers.get("Access-Control-Request-Method")).toBe("*");
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
        "OPTIONS, GET, POST",
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).toBe("*");
    });
  });

  describe("GET Handler", () => {
    it("handles requests successfully and sets CORS headers", async () => {
      const mockRequest = new NextRequest("http://localhost/api/trpc", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Make request
      const response = await GET(mockRequest);

      // Check the fetchrequesthandler is called with proper arguments
      expect(fetchRequestHandler).toHaveBeenCalledWith({
        endpoint: "/api/trpc",
        router: appRouter,
        req: mockRequest,
        createContext: expect.any(Function),
        onError: expect.any(Function),
      });

      // Check response to be success and have proper cors headers
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });

    it("logs errors during fetchRequestHandler execution", async () => {
      const mockRequest = new NextRequest("http://localhost/api/trpc", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Simulate error
      const mockFetchHandler = vi.fn(async () => {
        throw new Error("Fetch handler error");
      });
      fetchRequestHandler.mockImplementationOnce(mockFetchHandler);

      // Set a spy for consol.error
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      try {
        // Make request with error
        await GET(mockRequest);
      } catch (err) {
        // Check error are logged on console
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          ">>> tRPC Error on 'undefined'",
          expect.any(Error),
        );
      }

      // Remove spy from console.error
      consoleErrorSpy.mockRestore();
    });
  });

  describe("POST Handler", () => {
    it("handles POST requests successfully and sets CORS headers", async () => {
      const requestBody = JSON.stringify({
        title: "New Post",
        content: "Post content",
      });

      const mockRequest = new NextRequest("http://localhost/api/trpc", {
        method: "POST",
        body: requestBody,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Make request
      const response = await POST(mockRequest);

      // Check the fetchrequesthandler is called with proper arguments
      expect(fetchRequestHandler).toHaveBeenCalledWith({
        endpoint: "/api/trpc",
        router: appRouter,
        req: mockRequest,
        createContext: expect.any(Function),
        onError: expect.any(Function),
      });

      // Check response to be success and have proper cors headers
      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    });
  });
});
