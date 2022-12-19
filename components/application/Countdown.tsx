import React from "react";
import { TypographyProps } from "@ecoinc/ecomponents";
import ReactCountdown from "react-countdown";
import { MonoText } from "./commons/MonoText";

interface CountdownProps extends Omit<TypographyProps, "children"> {
  date: Date;
  onComplete?(): void;
}

export const Countdown: React.FC<CountdownProps> = ({
  date,
  onComplete,
  ...props
}) => {
  if (!date || isNaN(date.getTime()) || Date.now() > date.getTime())
    return <MonoText {...props}>0 Days: 0 hrs: 0 mins: 0 secs</MonoText>;

  return (
    <ReactCountdown
      date={date}
      onComplete={onComplete}
      renderer={({ days, hours, minutes, seconds, completed }) => {
        if (completed)
          return <MonoText {...props}>0 Days: 0 hrs: 0 mins: 0 secs</MonoText>;
        return (
          <MonoText {...props}>
            {days} Days: {hours} hrs: {minutes} mins: {seconds} secs
          </MonoText>
        );
      }}
    />
  );
};
