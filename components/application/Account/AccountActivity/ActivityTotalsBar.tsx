import React from "react";
import { Column, Row, styled, Typography } from "@ecoinc/ecomponents";

interface ActivityTotalsBarProps {
  proposalsSubmitted: number;
  votesSubmitted: number;
  proposalsSupported: number;
}

const Box = styled(Row)(({ theme }) => ({
  borderRadius: 12,
  padding: "12px 16px",
  justifyContent: "space-between",
  background: theme.palette.secondary.bg,
}));

const ActivityTotalsBar: React.FC<ActivityTotalsBarProps> = ({
  proposalsSubmitted,
  votesSubmitted,
  proposalsSupported,
}) => {
  return (
    <Box gap="xl">
      <Column>
        <Typography variant="h5">
          {proposalsSupported ? proposalsSupported : 0}
        </Typography>
        <Typography variant="subtitle1" color="secondary">
          SUPPORTED
        </Typography>
      </Column>
      <Column>
        <Typography variant="h5">
          {votesSubmitted ? votesSubmitted : 0}
        </Typography>
        <Typography variant="subtitle1" color="secondary">
          VOTED
        </Typography>
      </Column>
      <Column>
        <Typography variant="h5">
          {proposalsSubmitted ? proposalsSubmitted : 0}
        </Typography>
        <Typography variant="subtitle1" color="secondary">
          SUBMITTED
        </Typography>
      </Column>
    </Box>
  );
};

export default ActivityTotalsBar;
