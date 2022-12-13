import { TopBar } from "../../commons/TopBar";
import {
  Column,
  Dialog,
  formatNumber,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  RandomInflationActionType,
  useRandomInflations,
} from "../../../hooks/useRandomInflations";
import { tokensToNumber } from "../../../../utilities";
import { Zero } from "@ethersproject/constants";
import { RandomInflationRecipient } from "../../../../types";
import { RandomInflationClaimRows } from "./RandomInflationClaimRows";
import { RIClaimBox } from "./RIClaimBox";

const Content = styled(Column)({ padding: "0 24px" });

function getReceiptID(receipt: RandomInflationRecipient): string {
  return `${receipt.randomInflation.address}-${receipt.index}`;
}

export const RandomInflationNotification = () => {
  const account = useAccount();
  const address = account.address?.toLowerCase();

  const {
    items: randomInflations,
    dispatch,
    called,
    loading: loadingRIs,
  } = useRandomInflations();

  const [open, setOpen] = useState(false);
  const [availableClaims, setAvailableClaims] = useState<string[]>([]);
  const [randomInflationIDs, setRandomInflationIds] = useState<string[]>([]);

  useEffect(() => {
    if (called && !loadingRIs) {
      const ids = randomInflations
        .filter((ri) =>
          ri.recipients.some(
            ({ recipient, claimed, claimableAt }) =>
              !claimed &&
              recipient === address &&
              Date.now() > claimableAt.getTime()
          )
        )
        .map((ri) => ri.address);
      setRandomInflationIds(ids);
    }
  }, [address, called, loadingRIs, randomInflations]);

  const claimRIs = randomInflations.filter((ri) =>
    randomInflationIDs.includes(ri.address)
  );

  useEffect(() => {
    if (!availableClaims.length) {
      const recipientIDs = claimRIs
        .flatMap((ri) => ri.recipients)
        .filter((r) => !r.claimed && r.recipient === address)
        .map(getReceiptID);
      setAvailableClaims(recipientIDs);
    }
  }, [address, availableClaims.length, claimRIs]);

  const pendingClaims = claimRIs
    .flatMap((ri) => ri.recipients)
    .filter((r) => !r.claimed && r.recipient === address);

  if (!pendingClaims.length) return null;

  const recipients = claimRIs
    .flatMap((ri) => ri.recipients)
    .filter((r) => availableClaims.includes(getReceiptID(r)));

  const amount = recipients
    .filter((recipient) => !recipient.claimed)
    .reduce((acc, reward) => acc.add(reward.randomInflation.reward), Zero);

  const onClaimed = (recipient: RandomInflationRecipient) => {
    dispatch({
      type: RandomInflationActionType.Claim,
      recipient: recipient.recipient,
      sequence: recipient.sequenceNumber,
      randomInflationId: recipient.randomInflation.address,
    });
  };

  return (
    <React.Fragment>
      <TopBar onClick={() => setOpen(true)}>
        <b>
          Congratulations! You’ve received{" "}
          {formatNumber(tokensToNumber(amount))} ECO
        </b>{" "}
        from random inflation. Claim it now
      </TopBar>
      <Dialog isOpen={open} onRequestClose={() => setOpen(false)}>
        <Column gap="xl">
          <Content gap="lg">
            <Typography variant="h2">Random inflation</Typography>
            <Typography variant="body1">
              You have <b>{formatNumber(tokensToNumber(amount))} ECO</b>{" "}
              available to claim
              {claimRIs.length > 1
                ? ` from ${claimRIs.length} random inflations.`
                : "."}
            </Typography>
          </Content>
          {recipients.length === 1 ? (
            <RIClaimBox recipient={recipients[0]} onClaimed={onClaimed} />
          ) : (
            <RandomInflationClaimRows
              claims={recipients}
              onClaimed={onClaimed}
              randomInflations={claimRIs}
            />
          )}
        </Column>
      </Dialog>
    </React.Fragment>
  );
};
