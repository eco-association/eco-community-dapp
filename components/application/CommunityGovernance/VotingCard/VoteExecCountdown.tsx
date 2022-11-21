import React from "react";
import ReactCountdown from "react-countdown";
import { Alert, styled, Typography } from "@ecoinc/ecomponents";

interface VoteExecCountdownProps {
  date: Date;
}

const StyledAlert = styled(Alert)({ fontSize: 15, "& span": { fontSize: 15 } });

export const VoteExecCountdown: React.FC<VoteExecCountdownProps> = ({
  date,
}) => {
  return (
    <StyledAlert
      color="disabled"
      title={<Typography variant="h5">Proposal executes in </Typography>}
    >
      <ReactCountdown
        date={date}
        renderer={({ days, hours, minutes, seconds }) => (
          <Typography variant="body3" color="secondary">
            {days}days: {hours}hours: {minutes}mins: {seconds}secs
          </Typography>
        )}
      />
    </StyledAlert>
  );
};
