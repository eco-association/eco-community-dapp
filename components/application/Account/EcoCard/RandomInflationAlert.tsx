import React from "react";
import {
  Alert,
  Button,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { tokensToNumber } from "../../../../utilities";
import { useRandomInflation } from "../../../../providers/RandomInflationProvider";

const StyledAlert = styled(Alert)({
  "& span": {
    lineHeight: 1,
  },
});

export const RandomInflationAlert: React.FC = () => {
  const { setModalOpen, claimableAmount, pendingClaims } = useRandomInflation();

  if (!pendingClaims.length) return null;

  return (
    <StyledAlert
      color="active"
      title={
        <Typography variant="body2" color="active">
          <b>Random Inflation Received</b>
        </Typography>
      }
      button={
        <Row justify="end">
          <Button
            size="sm"
            color="active"
            variant="outline"
            onClick={() => setModalOpen(true)}
            style={{ padding: "8px 16px", minWidth: "initial" }}
          >
            Claim
          </Button>
        </Row>
      }
    >
      <Typography color="secondary" variant="body2">
        You have{" "}
        <Typography color="primary" variant="body2">
          <b>{formatNumber(tokensToNumber(claimableAmount))} ECO</b>
        </Typography>{" "}
        to claim
      </Typography>
    </StyledAlert>
  );
};
