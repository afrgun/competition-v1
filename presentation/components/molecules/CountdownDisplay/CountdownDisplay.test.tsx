import { render, screen } from "@testing-library/react";
import { CountdownDisplay } from "./CountdownDisplay";
import { Countdown } from "@/domain/entities";

describe("CountdownDisplay", () => {
  it("renders countdown with all time units", () => {
    const countdown: Countdown = {
      days: 5,
      hours: 12,
      minutes: 30,
      seconds: 45,
      isFinished: false,
    };

    render(<CountdownDisplay countdown={countdown} />);

    expect(screen.getByText("05")).toBeInTheDocument();
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Hours")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Minutes")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
    expect(screen.getByText("Seconds")).toBeInTheDocument();
  });

  it("shows completion message when countdown is finished", () => {
    const countdown: Countdown = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: true,
    };

    render(<CountdownDisplay countdown={countdown} />);

    expect(screen.getByText(/Competition Started!/i)).toBeInTheDocument();
  });

  it("does not render timers when finished", () => {
    const countdown: Countdown = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isFinished: true,
    };

    render(<CountdownDisplay countdown={countdown} />);

    expect(screen.queryByText("Days")).not.toBeInTheDocument();
    expect(screen.queryByText("Hours")).not.toBeInTheDocument();
  });
});
