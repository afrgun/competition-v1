import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "./RegisterForm";
import { registerUserInteractor } from "@/usecases/auth/registerUser";
import { useRouter } from "next/navigation";

// Mock dependencies
jest.mock("@/usecases/auth/registerUser");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("RegisterForm", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByText(/i agree to the terms/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    render(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: /register/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("validates email format", async () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/email/i);
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });

  it("validates password requirements", async () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/password/i);

    // Test minimum length
    fireEvent.change(passwordInput, { target: { value: "abc" } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });

    // Test uppercase requirement
    fireEvent.change(passwordInput, { target: { value: "abcdef" } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/at least one uppercase/i)).toBeInTheDocument();
    });

    // Test special character requirement
    fireEvent.change(passwordInput, { target: { value: "Abcdef" } });
    fireEvent.blur(passwordInput);
    await waitFor(() => {
      expect(screen.getByText(/at least one special character/i)).toBeInTheDocument();
    });
  });

  it("submits form successfully and redirects to login", async () => {
    (registerUserInteractor as jest.Mock).mockResolvedValue({
      success: true,
      message: "Registration successful",
    });

    render(<RegisterForm />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "081234567890" },
    });
    fireEvent.change(screen.getByLabelText(/job role/i), {
      target: { value: "Developer" },
    });
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: "Tech Company" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("displays error message on registration failure", async () => {
    (registerUserInteractor as jest.Mock).mockResolvedValue({
      success: false,
      message: "Email already exists",
    });

    render(<RegisterForm />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone number/i), {
      target: { value: "081234567890" },
    });
    fireEvent.change(screen.getByLabelText(/job role/i), {
      target: { value: "Developer" },
    });
    fireEvent.change(screen.getByLabelText(/institution/i), {
      target: { value: "Tech Company" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
    });
  });
});
