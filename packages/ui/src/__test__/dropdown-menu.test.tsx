import React from "react";

import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../dropdown-menu";

describe("DropdownMenu Component", () => {
  it("renders the basic menu", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    expect(trigger).toBeInTheDocument();
  });

  it("shows menu items when trigger is clicked", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const item1 = screen.getByText("Item 1");
    const item2 = screen.getByText("Item 2");

    expect(item1).toBeInTheDocument();
    expect(item2).toBeInTheDocument();
  });

  it("renders submenu and shows it when subtrigger is clicked", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Open Submenu</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>Subitem 1</DropdownMenuSubContent>
            <DropdownMenuSubContent>Subitem 2</DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const subTrigger = screen.getByText(/open submenu/i);

    // Simulate user click which should open the subDropDownMenu
    expect(subTrigger).toBeInTheDocument();

    await userEvent.click(subTrigger);

    const subitem1 = screen.getByText("Subitem 1");
    const subitem2 = screen.getByText("Subitem 2");

    expect(subitem1).toBeInTheDocument();
    expect(subitem2).toBeInTheDocument();
  });

  it("renders a checkbox item and toggles it state when clicked", async () => {
    const onCheckedChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Checkbox Item
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const checkbox = screen.getByText("Checkbox Item");
    expect(checkbox).toBeInTheDocument();

    // Simulate user click for toggling checkbox
    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders a radio group and change selection by clicking on radio item", async () => {
    const onValueChange = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            defaultValue="radio1"
            onValueChange={onValueChange}
          >
            <DropdownMenuRadioItem value="radio1">
              Radio Item 1
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="radio2">
              Radio Item 2
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const radioItem1 = screen.getByText("Radio Item 1");
    const radioItem2 = screen.getByText("Radio Item 2");

    expect(radioItem1).toBeInTheDocument();
    expect(radioItem2).toBeInTheDocument();

    // Simulate user click to change radio button
    await userEvent.click(radioItem2);
    expect(onValueChange).toHaveBeenCalledWith("radio2");
  });

  it("renders a label and separator", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const label = screen.getByText("Menu Label");
    const separator = screen.getByRole("separator");

    expect(label).toBeInTheDocument();
    expect(separator).toBeInTheDocument();
  });

  it("renders group, portal and shortcut", async () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuPortal>
            <DropdownMenuGroup>
              <DropdownMenuShortcut data-testid="shortcut" />
            </DropdownMenuGroup>
          </DropdownMenuPortal>
        </DropdownMenuContent>
      </DropdownMenu>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const shortcut = screen.getByTestId("shortcut");
    expect(shortcut).toBeInTheDocument();
  });

  it("closes the menu when clicking outside", async () => {
    render(
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button>Outside Button</button>
      </div>,
    );

    const trigger = screen.getByRole("button", { name: /open menu/i });

    // Simulate user click which should open the dropDownMenu
    await userEvent.click(trigger);

    const item1 = screen.getByText("Item 1");
    expect(item1).toBeInTheDocument();

    const outsideButton = screen.getByText("Outside Button");

    // Simulate user click outside the dropDownMenu
    await userEvent.click(outsideButton, {
      pointerEventsCheck: PointerEventsCheckLevel.Never,
    });

    expect(item1).not.toBeInTheDocument();
  });
});
