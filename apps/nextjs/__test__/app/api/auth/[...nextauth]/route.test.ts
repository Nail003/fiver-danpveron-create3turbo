import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { handlers } from "@acme/auth";

import { GET, POST } from "~/app/api/auth/[...nextauth]/route"; // Adjust the path

// Mock dependencies
vi.mock("@acme/auth", () => ({
  handlers: {
    POST: vi.fn(),
    GET: vi.fn(),
  },
  isSecureContext: true,
}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("API Route Tests", () => {
  let mockCookies: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCookies = {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    };
    cookies.mockReturnValue(mockCookies);
  });

  describe("POST Handler", () => {
    it("calls the POST handler from @acme/auth correctly and returns its value as response", async () => {
      const mockRequest = new NextRequest("http://example.com/api/auth");
      const mockResponse = new NextResponse(null, { status: 200 });

      // Mock handler response
      handlers.POST.mockResolvedValue(mockResponse);

      // Make request
      const result = await POST(mockRequest);

      // Make sure the handler post is called and its return value is given as response
      expect(handlers.POST).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });
  });

  describe("GET Handler", () => {
    it("sets a cookie for Expo sign-in during signin action", async () => {
      // Make request with expo redirect
      const mockRequest = new NextRequest(
        "http://example.com/api/auth/signin?expo-redirect=http://expo.io",
      );
      const mockResponse = new NextResponse(null, { status: 200 });

      // Mock handler response
      handlers.GET.mockResolvedValue(mockResponse);

      // Props for signin request
      const props = { params: { nextauth: ["signin"] } };

      // Make request
      const response = await GET(mockRequest, props);

      // Check that the cookie is set to the correct values
      expect(mockCookies.set).toHaveBeenCalledWith({
        name: "__acme-expo-redirect-state",
        value: "http://expo.io",
        maxAge: 60 * 10,
        path: "/",
      });

      // Response should be the return value of handler GET
      expect(response).toBe(mockResponse);
    });

    it("handles Expo callback and redirects with session token", async () => {
      // Make request for callback
      const mockRequest = new NextRequest(
        "http://example.com/api/auth/callback",
      );

      // Params for callback response
      const params = { params: { nextauth: ["callback"] } };
      mockCookies.get.mockReturnValue({ value: "http://expo.io" });

      // Add a fake session cookie
      const mockAuthResponse = new NextResponse(null, {
        status: 200,
        headers: {
          "Set-Cookie": ["authjs.session-token=example-token; Path=/"],
        },
      });

      // Mock handlers GET to return mocked response
      handlers.GET.mockResolvedValue(mockAuthResponse);

      // Make request
      const result = await GET(mockRequest, params);

      // Check if the delete command is called with default cookie
      expect(mockCookies.delete).toHaveBeenCalledWith(
        "__acme-expo-redirect-state",
      );

      expect(result.status).toBe(307); // Redirect

      expect(result.headers.get("location")).toBe(
        "http://expo.io/?session_token=example-token",
      );
    });

    it("calls the default handler for other actions", async () => {
      const mockRequest = new NextRequest("http://example.com/api/auth/other");
      const params = { params: { nextauth: ["other"] } };

      // Mock response
      const mockResponse = new NextResponse(null, { status: 200 });
      // Mock default handler
      handlers.GET.mockResolvedValue(mockResponse);

      // Make request
      const result = await GET(mockRequest, params);

      // Make sure the default handler is called correctly and its value is returned as response
      expect(handlers.GET).toHaveBeenCalledWith(mockRequest);
      expect(result).toBe(mockResponse);
    });
  });
});
