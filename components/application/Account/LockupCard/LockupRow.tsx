import React from "react";
import moment from "moment";
import { Column, formatNumber, Typography } from "@ecoinc/ecomponents";
import {
  getLockupAPY,
  getLockupDates,
  numberFormatter,
  tokensToNumber,
} from "../../../../utilities";
import { LockupTableRow } from "./LockupTableRow";
import { LockupClaimAlert } from "./LockupClaimAlert";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { Arrow } from "../../commons/Arrow";

interface LockupRowProps {
  lockup: FundsLockupWithDeposit;

  onClick(): void;
}

export const LockupRow: React.FC<LockupRowProps> = ({ lockup, onClick }) => {
  const dates = getLockupDates(lockup);

  const ended = Boolean(lockup.withdrawnAt);
  const status = ended ? "COMPLETED" : "ACTIVE";
  const color = ended ? "secondary" : "primary";

  const duration = ended
    ? `ENDED ON ${moment(dates.end).format("L")}`
    : `${moment(dates.start).format("L")} - ${moment(dates.end).format("L")}`;

  const amount = lockup.reward.mul(1e9).div(lockup.interest * 1e7);

  const row = (
    <LockupTableRow clickable={!ended} onClick={() => !ended && onClick()}>
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
      {!ended ? <Arrow color="primary" /> : null}
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
