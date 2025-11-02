import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders with primary variant by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-blue-600");
  });

  it("renders with secondary variant", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText("Secondary");
    expect(button).toHaveClass("bg-gray-200");
  });

  it("renders with danger variant", () => {
    render(<Button variant="danger">Danger</Button>);
    const button = screen.getByText("Danger");
    expect(button).toHaveClass("bg-red-600");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByText("Small")).toHaveClass("px-3 py-1.5");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByText("Medium")).toHaveClass("px-4 py-2");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByText("Large")).toHaveClass("px-6 py-3");
  });

  it("shows loading state", () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("is disabled when loading", () => {
    render(<Button isLoading>Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});
