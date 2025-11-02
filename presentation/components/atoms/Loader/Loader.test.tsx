import { render } from "@testing-library/react";
import { Loader } from "./Loader";

describe("Loader", () => {
  it("renders loader", () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("animate-spin");
  });

  it("renders with different sizes", () => {
    const { container, rerender } = render(<Loader size="sm" />);
    expect(container.querySelector("svg")).toHaveClass("h-4 w-4");

    rerender(<Loader size="md" />);
    expect(container.querySelector("svg")).toHaveClass("h-8 w-8");

    rerender(<Loader size="lg" />);
    expect(container.querySelector("svg")).toHaveClass("h-12 w-12");
  });

  it("renders with different colors", () => {
    const { container, rerender } = render(<Loader color="primary" />);
    expect(container.querySelector("svg")).toHaveClass("text-blue-600");

    rerender(<Loader color="white" />);
    expect(container.querySelector("svg")).toHaveClass("text-white");

    rerender(<Loader color="gray" />);
    expect(container.querySelector("svg")).toHaveClass("text-gray-600");
  });

  it("renders fullscreen loader", () => {
    const { container } = render(<Loader fullScreen />);
    const wrapper = container.querySelector(".min-h-screen");
    expect(wrapper).toBeInTheDocument();
  });
});
