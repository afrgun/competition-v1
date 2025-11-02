import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input", () => {
  it("renders input field", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(<Input helperText="Enter your email address" />);
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(
      <Input error="Error message" helperText="This should not appear" />
    );
    expect(screen.getByText("Error message")).toBeInTheDocument();
    expect(screen.queryByText("This should not appear")).not.toBeInTheDocument();
  });

  it("applies error styles when error prop is present", () => {
    render(<Input error="Error" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-red-500");
  });

  it("can be disabled", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });
});
