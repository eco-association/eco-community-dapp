import React, { useState } from "react";
import { displayAddress, txError } from "../../../../utilities";
import { RandomInflationRecipient } from "../../../../types";
import { useRandomInflation as useRandomInflationContract } from "../../../hooks/contract/useRandomInflation";
import { Button, Column, Row, styled, Typography } from "@ecoinc/ecomponents";
import LoaderAnimation from "../../Loader";
import { GasFee } from "../../commons/GasFee";
import { useAccount } from "wagmi";
import TextLoader from "../../commons/TextLoader";
import { toast as nativeToast, ToastOptions } from "react-toastify";

export interface RIClaimBoxProps {
  recipient: RandomInflationRecipient;

  onClaimed(recipient: RandomInflationRecipient): void;
}

const Box = styled(Column)(({ theme }) => ({
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

export const RIClaimBox: React.FC<RIClaimBoxProps> = ({
  recipient,
  onClaimed,
}) => {
  const account = useAccount();
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
    <Box gap="lg">
      <Row gap="sm">
        <Typography variant="body1">Move to your wallet </Typography>
        <Typography variant="body1" color="secondary">
          Eth Address {displayAddress(account.address)}
        </Typography>
      </Row>
      <Column gap="md" items="start">
        <Row gap="md" items="center">
          <Button color="success" onClick={claim} disabled={loading}>
            {!loading ? "Claim" : <LoaderAnimation />}
          </Button>
          {loading && <TextLoader />}
        </Row>
        <GasFee gasLimit={211_000} />
      </Column>
    </Box>
  );
};
