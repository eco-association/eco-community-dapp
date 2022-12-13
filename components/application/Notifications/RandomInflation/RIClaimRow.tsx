import React, { useEffect, useState } from "react";
import {
  formatCountdown,
  tokensToNumber,
  txError,
} from "../../../../utilities";
import { RandomInflationRecipient } from "../../../../types";
import { useRandomInflation as useRandomInflationContract } from "../../../hooks/contract/useRandomInflation";
import {
  Button,
  Column,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import LoaderAnimation from "../../Loader";
import ReactCountdown from "react-countdown";

interface RIClaimRowProps {
  recipient: RandomInflationRecipient;
  onClaimed(): void;
}

const Box = styled(Row)(({ theme }) => ({
  padding: "8px 16px",
  borderRadius: 4,
  backgroundColor: theme.palette.disabled.bg,
}));

export const RIClaimRow: React.FC<RIClaimRowProps> = ({ recipient }) => {
  const contract = useRandomInflationContract(
    recipient.randomInflation.address
  );

  const [loading, setLoading] = useState(false);
  const [claimable, setClaimable] = useState(
    Date.now() > recipient.claimableAt.getTime()
  );

  useEffect(() => {
    if (!claimable) {
      const diff = recipient.claimableAt.getTime() - Date.now();
      const timeout = setTimeout(() => setClaimable(true), diff);
      return () => clearTimeout(timeout);
    }
  }, [claimable, recipient.claimableAt]);

  const claim = async () => {
    setLoading(true);
    try {
      const claimTx = await contract.claimFor(
        recipient.recipient,
        recipient.sequenceNumber,
        recipient.proof,
        recipient.leafSum,
        recipient.index
      );
      await claimTx.wait();
    } catch (err) {
      txError("Failed claiming random inflation", err);
    }
    setLoading(false);
  };

  return (
    <Box items="center" justify="space-between">
      <Column>
        <Row gap="sm">
          <Typography variant="h5">
            <b>Sequence #{recipient.sequenceNumber}</b>
          </Typography>
          {recipient.claimed ? (
            <Typography variant="h5" color="secondary">
              • Claimed
            </Typography>
          ) : !claimable ? (
            <Typography variant="h5" color="info">
              • Waiting...
            </Typography>
          ) : (
            <Typography variant="h5" color="active">
              • Claim
            </Typography>
          )}
        </Row>
        {claimable || recipient.claimed ? (
          <Typography variant="body2" color="secondary">
            {recipient.claimed ? "You have claimed" : "You can claim"}{" "}
            {formatNumber(tokensToNumber(recipient.randomInflation.reward))} ECO
          </Typography>
        ) : (
          <Typography variant="body2" color="secondary">
            <ReactCountdown
              date={recipient.claimableAt}
              renderer={(countdownData) => {
                const remaining = formatCountdown(countdownData);
                return `${remaining.amount} ${remaining.unit} remaining to claim`;
              }}
            />
          </Typography>
        )}
      </Column>
      {recipient.claimed || !claimable ? null : (
        <Button size="sm" color="success" onClick={claim} disabled={loading}>
          {!loading ? "Claim" : <LoaderAnimation />}
        </Button>
      )}
    </Box>
  );
};
