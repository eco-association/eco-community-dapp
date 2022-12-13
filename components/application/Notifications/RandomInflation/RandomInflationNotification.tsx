import { TopBar } from "../../commons/TopBar";
import {
  Column,
  Dialog,
  formatNumber,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import {
  RandomInflationActionType,
  useRandomInflations,
} from "../../../hooks/useRandomInflations";
import { tokensToNumber } from "../../../../utilities";
import { Zero } from "@ethersproject/constants";
import { RIClaimRow } from "./RIClaimRow";
import moment from "moment";
import { RandomInflationRecipient } from "../../../../types";

const Content = styled(Column)({ padding: "0 16px" });

function formatDate(date: Date): string {
  return moment(date).format("MM.DD.YY");
}

export const RandomInflationNotification = () => {
  const account = useAccount();
  const { items: randomInflations, dispatch } = useRandomInflations();

  const [open, setOpen] = useState(false);

  const address = account.address?.toLowerCase();
  const claimRIs = randomInflations.filter((ri) =>
    ri.recipients.some(
      ({ recipient, claimed, claimableAt }) =>
        !claimed && recipient === address && Date.now() > claimableAt.getTime()
    )
  );

  if (!claimRIs.length) return null;

  const recipients = claimRIs
    .flatMap((ri) => ri.recipients)
    .filter((recipient) => recipient.recipient === address);

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

  let rows;
  if (claimRIs.length === 1) {
    rows = recipients.map((recipient) => (
      <RIClaimRow
        key={recipient.sequenceNumber}
        recipient={recipient}
        onClaimed={() => onClaimed(recipient)}
      />
    ));
  } else {
    rows = claimRIs.flatMap((ri) => {
      const end = new Date(
        ri.claimPeriodStarts.getTime() + ri.claimPeriodDuration
      );
      const riRecipients = recipients.filter(
        (r) => r.randomInflation.address === ri.address
      );
      return (
        <Column gap="md">
          <Typography
            variant="h6"
            color="secondary"
            style={{ paddingLeft: 16 }}
          >
            PERIOD {formatDate(ri.claimPeriodStarts)} - {formatDate(end)}
          </Typography>
          <Column gap="lg">
            {riRecipients.map((recipient) => (
              <RIClaimRow
                key={`${ri.address}-${recipient.sequenceNumber}`}
                recipient={recipient}
                onClaimed={() => onClaimed(recipient)}
              />
            ))}
          </Column>
        </Column>
      );
    });
  }

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
          <Column gap="lg">{rows}</Column>
        </Column>
      </Dialog>
    </React.Fragment>
  );
};
