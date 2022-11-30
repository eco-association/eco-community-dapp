import { LockupTableRow } from "./LockupTableRow";
import { Column, formatNumber, Typography } from "@ecoinc/ecomponents";
import React from "react";
import {
  getLockupAPY,
  getLockupDates,
  numberFormatter,
  tokensToNumber,
} from "../../../../utilities";
import moment from "moment";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { LockupClaimAlert } from "./LockupClaimAlert";

interface LockupRowProps {
  lockup: FundsLockupWithDeposit;
}

export const LockupRow: React.FC<LockupRowProps> = ({ lockup }) => {
  const dates = getLockupDates(lockup);

  const ended = Boolean(lockup.withdrawnAt);
  const status = ended ? "COMPLETED" : "ACTIVE";
  const color = ended ? "secondary" : "primary";

  const duration = ended
    ? `ENDED ON ${moment(dates.end).format("L")}`
    : `${moment(dates.start).format("L")} - ${moment(dates.end).format("L")}`;

  const amount = lockup.reward.mul(1e9).div(lockup.interest * 1e7);

  const row = (
    <LockupTableRow>
      <Typography variant="body2" color={color}>
        {formatNumber(tokensToNumber(amount))}
      </Typography>
      <Typography variant="body2" color={color}>
        {numberFormatter(getLockupAPY(lockup))}%
      </Typography>
      <Typography variant="body2" color={color}>
        {status}
      </Typography>
      <Typography variant="body2" color={color}>
        {duration}
      </Typography>
    </LockupTableRow>
  );

  if (Date.now() > lockup.lockupEndsAt.getTime() && !lockup.withdrawnAt) {
    return (
      <Column gap="lg">
        {row}
        <LockupClaimAlert lockup={lockup} />
      </Column>
    );
  }
  return row;
};
