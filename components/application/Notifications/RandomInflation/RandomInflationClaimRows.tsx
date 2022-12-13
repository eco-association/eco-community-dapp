import { Column, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { RIClaimRow, RIClaimRowProps } from "./RIClaimRow";
import moment from "moment";
import {
  RandomInflationRecipient,
  RandomInflationWithClaims,
} from "../../../../types";

function formatDate(date: Date): string {
  return moment(date).format("MM.DD.YY");
}

interface RandomInflationClaimRowsProps
  extends Pick<RIClaimRowProps, "onClaimed"> {
  claims: RandomInflationRecipient[];
  randomInflations: RandomInflationWithClaims[];
}

export const RandomInflationClaimRows: React.FC<
  RandomInflationClaimRowsProps
> = ({ claims, randomInflations, onClaimed }) => {
  let rows;
  if (randomInflations.length === 1) {
    rows = claims.map((recipient) => (
      <RIClaimRow
        key={recipient.sequenceNumber}
        recipient={recipient}
        onClaimed={onClaimed}
      />
    ));
  } else {
    rows = randomInflations.flatMap((ri) => {
      const end = new Date(
        ri.claimPeriodStarts.getTime() + ri.claimPeriodDuration
      );
      const riRecipients = claims.filter(
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
    <Column gap="lg" style={{ maxHeight: 400, overflowY: "auto" }}>
      {rows}
    </Column>
  );
};
