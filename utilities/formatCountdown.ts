import { CountdownRenderProps } from "react-countdown/dist/Countdown";

export function formatCountdown(countdown: CountdownRenderProps): {
  amount: number;
  unit: string;
} {
  if (countdown.days > 0) return { amount: countdown.days + 1, unit: "days" };
  if (countdown.hours > 0)
    return { amount: countdown.hours + 1, unit: "hours" };
  if (countdown.minutes > 0)
    return { amount: countdown.minutes + 1, unit: "minutes" };
  return { amount: countdown.seconds, unit: "seconds" };
}
