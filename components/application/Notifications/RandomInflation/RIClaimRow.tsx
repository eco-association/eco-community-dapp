import React, { useState } from "react";
import { tokensToNumber, txError } from "../../../../utilities";
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
import { toast as nativeToast, ToastOptions } from "react-toastify";

export interface RIClaimRowProps {
  recipient: RandomInflationRecipient;

  onClaimed(recipient: RandomInflationRecipient): void;
}

const Box = styled(Row)(({ theme }) => ({
  borderRadius: 4,
  padding: "16px 24px",
  backgroundColor: theme.palette.disabled.bg,
}));

const toastOpts: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: true,
  theme: "colored",
  style: {
    backgroundColor: "#F7FEFC",
    border: "solid 1px #5AE4BF",
    color: "#22313A",
    top: "115px",
  },
};

export const RIClaimRow: React.FC<RIClaimRowProps> = ({
  recipient,
  onClaimed,
}) => {
  const [loading, setLoading] = useState(false);

  const contract = useRandomInflationContract(
    recipient.randomInflation.address
  );

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
      nativeToast("Success! Inflation reward claimed.", toastOpts);
      onClaimed(recipient);
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
            <b>Claim #{recipient.sequenceNumber + 1}</b>
          </Typography>
          {recipient.claimed ? (
            <Typography variant="h5" color="secondary">
              • Claimed
            </Typography>
          ) : (
            <Typography variant="h5" color="active">
              • Claim
            </Typography>
          )}
        </Row>
        <Typography variant="body2" color="secondary">
          {recipient.claimed ? "You have claimed" : "You can claim"}{" "}
          {formatNumber(tokensToNumber(recipient.randomInflation.reward))} ECO
        </Typography>
      </Column>
      {recipient.claimed ? null : (
        <Button size="sm" color="success" onClick={claim} disabled={loading}>
          {!loading ? "Claim" : <LoaderAnimation />}
        </Button>
      )}
    </Box>
  );
};
