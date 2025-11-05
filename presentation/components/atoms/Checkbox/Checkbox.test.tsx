import { render, screen } from "@testing-library/react";
import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders checkbox without label", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeInTheDocument();
  });

  it("renders checkbox with label", () => {
    render(<Checkbox label="I agree to terms" />);
    const label = screen.getByText("I agree to terms");
    expect(label).toBeInTheDocument();
  });

  it("shows error message when error prop is provided", () => {
    render(<Checkbox label="Accept" error="This field is required" />);
    const error = screen.getByText("This field is required");
    expect(error).toBeInTheDocument();
    expect(error).toHaveClass("text-red-600");
  });

  it("can be checked", () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  it("forwards additional props", () => {
    render(<Checkbox data-testid="custom-checkbox" />);
    const checkbox = screen.getByTestId("custom-checkbox");
    expect(checkbox).toBeInTheDocument();
  });
});
