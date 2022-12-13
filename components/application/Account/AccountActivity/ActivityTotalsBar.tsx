import { Column, Row, Typography } from "@ecoinc/ecomponents";

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
    <Row
      gap="xl"
      style={{ borderBottom: "1px solid #c7d9ea", paddingBottom: 12 }}
    >
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
    </Row>
  );
};

export default ActivityTotalsBar;
