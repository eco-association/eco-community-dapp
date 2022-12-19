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
    <ActivityTotals gap="xl">
      <Column>
        <Typography variant="h5">{proposalsSupported}</Typography>
        <Typography variant="subtitle1" color="secondary">
          proposals supported
        </Typography>
      </Column>
      <Column>
        <Typography variant="h5">{votesSubmitted}</Typography>
        <Typography variant="subtitle1" color="secondary">
          votes submitted
        </Typography>
      </Column>
      <Column>
        <Typography variant="h5">{proposalsSubmitted}</Typography>
        <Typography variant="subtitle1" color="secondary">
          proposals submitted
        </Typography>
      </Column>
    </ActivityTotals>
  );
};

export default ActivityTotalsBar;
