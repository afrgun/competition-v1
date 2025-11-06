import { render, screen } from "@testing-library/react";
import { Timer } from "./Timer";

describe("Timer", () => {
  it("renders timer with value and label", () => {
    render(<Timer value={5} label="Days" />);
    expect(screen.getByText("05")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
  });

  it("pads single digit values with zero", () => {
    render(<Timer value={3} label="Hours" />);
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("displays double digit values correctly", () => {
    render(<Timer value={42} label="Minutes" />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Timer value={10} label="Seconds" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
