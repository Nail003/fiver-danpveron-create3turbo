import React from "react";

import "@testing-library/jest-dom";

import { beforeEach } from "node:test";
import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
  useFormField,
} from "../form";

// Mock react-hook-form's `useFormContext`
vi.mock("react-hook-form", async () => {
  const originalModule = await vi.importActual("react-hook-form");

  return {
    ...originalModule,
    useFormContext: vi.fn(() => ({ getFieldState: vi.fn(), formState: "" })),
  };
});

const invalidMessage = {
  email: "Invalid Email",
  password: "Invalid Password",
};

const schema = z.object({
  email: z.string().max(10, invalidMessage.email),
  password: z.string().max(10, invalidMessage.password),
});

type TestFormTypes = {
  submitHandler?: (data: any) => {};
  email?: string;
  password?: string;
};

const TestForm = ({
  submitHandler,
  email = "",
  password = "",
}: TestFormTypes) => {
  const form = useForm({
    schema,
    defaultValues: { email, password },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          if (submitHandler !== undefined) {
            submitHandler(data);
          }
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={(field) => (
            <FormItem>
              <FormLabel>Title Label</FormLabel>
              <FormDescription>Title Description</FormDescription>
              <FormControl>
                <input {...field} placeholder="email" type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={(field) => (
            <FormItem>
              <FormLabel>Password Label</FormLabel>
              <FormDescription>Password Description</FormDescription>
              <FormControl>
                <input {...field} placeholder="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit Button</button>
      </form>
    </Form>
  );
};

describe("Form Component Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("useForm initializes with zod schema correctly", () => {
    const { result } = renderHook(() =>
      useForm({
        schema,
        defaultValues: { email: "Test Title", password: "Test Content" },
      }),
    );

    expect(result.current.getValues("email")).toBe("Test Title");
    expect(result.current.getValues("password")).toBe("Test Content");
  });

  it("throws error if useFormField is used outside of FormField", () => {
    expect(() => renderHook(() => useFormField())).toThrow(
      "useFormField should be used within <FormField>",
    );
  });

  it("renders Form and its elements", () => {
    render(<TestForm />);

    expect(screen.getByText("Title Label")).toBeInTheDocument();
    expect(screen.getByText("Title Description")).toBeInTheDocument();
    expect(screen.getByText("Password Label")).toBeInTheDocument();
    expect(screen.getByText("Password Label")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("submits form properly by providing correct input values to submithandler", async () => {
    const handleSubmitSpy = vi.fn();
    const mockInput = { email: "Email", password: "Password" };

    render(<TestForm {...mockInput} submitHandler={handleSubmitSpy} />);

    const emailInput = screen.getByPlaceholderText("email");
    const passwordInput = screen.getByPlaceholderText("password");
    const submitButton = screen.getByRole("button");

    const user = userEvent.setup();
    // Simulate user input
    await user.type(emailInput, mockInput.email);
    await user.type(passwordInput, mockInput.password);

    // Simulate user click on submitButton
    await user.click(submitButton);

    expect(handleSubmitSpy).toHaveBeenCalled();

    // The same test is passing in another test file but have no clue why it's failing here
    expect(handleSubmitSpy).toHaveBeenCalledWith(mockInput);
  });

  it("renders Form Input with accessibility attributes", () => {
    render(<TestForm />);

    const input = screen.getByPlaceholderText("email");

    expect(input).toHaveAttribute("aria-invalid", "false");
    expect(input).toHaveAttribute("aria-describedby");
  });
});
