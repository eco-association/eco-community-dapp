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
    </Row>
  );
};

export default ActivityTotalsBar;
