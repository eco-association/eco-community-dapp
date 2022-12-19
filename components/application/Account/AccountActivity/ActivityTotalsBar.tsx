import { Column, Row, styled, Typography } from "@ecoinc/ecomponents";

const ActivityTotals = styled(Row)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: 16,
  borderRadius: 12,
  justifyContent: "space-between",
}));
interface ActivityTotalsBarProps {
  proposalsSubmitted: number;
  votesSubmitted: number;
  proposalsSupported: number;
}

const ActivityTotalsBar: React.FC<ActivityTotalsBarProps> = ({
  proposalsSubmitted,
  votesSubmitted,
  proposalsSupported,
}) => {
  return (
    <ActivityTotals
      gap="xl"
      style={{
        padding: "12px",
        background: "#F6F9FB",
        borderRadius: "5px",
        justifyContent: "space-between",
      }}
    >
      <Column>
        <Typography variant="h5">
          {proposalsSupported ? proposalsSupported : 0}
        </Typography>
        <Typography variant="subtitle1" color="secondary">
          PROPOSED
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
    </ActivityTotals>
  );
};

export default ActivityTotalsBar;
