import { render, screen } from "@testing-library/react";
import { Text } from "./Text";

describe("Text", () => {
  it("renders text content", () => {
    render(<Text>Hello World</Text>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders as different HTML elements", () => {
    const { rerender } = render(<Text as="h1">Heading 1</Text>);
    expect(screen.getByText("Heading 1").tagName).toBe("H1");

    rerender(<Text as="span">Span text</Text>);
    expect(screen.getByText("Span text").tagName).toBe("SPAN");
  });

  it("applies variant styles", () => {
    render(<Text variant="h1">Large Heading</Text>);
    expect(screen.getByText("Large Heading")).toHaveClass("text-4xl");
  });

  it("applies color styles", () => {
    render(<Text color="danger">Error message</Text>);
    expect(screen.getByText("Error message")).toHaveClass("text-red-600");
  });

  it("applies weight styles", () => {
    render(<Text weight="bold">Bold text</Text>);
    expect(screen.getByText("Bold text")).toHaveClass("font-bold");
  });

  it("combines multiple style props", () => {
    render(
      <Text variant="h2" color="secondary" weight="semibold">
        Combined
      </Text>
    );
    const element = screen.getByText("Combined");
    expect(element).toHaveClass("text-3xl");
    expect(element).toHaveClass("text-gray-600");
    expect(element).toHaveClass("font-semibold");
  });

  it("accepts custom className", () => {
    render(<Text className="custom-class">Custom</Text>);
    expect(screen.getByText("Custom")).toHaveClass("custom-class");
  });
});
