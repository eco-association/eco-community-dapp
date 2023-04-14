import React from "react";
import moment from "moment";
import { Color, formatNumber, Row, Typography } from "@ecoinc/ecomponents";
import {
  getLockupDates,
  isLockupClaimable,
  numberFormatter,
  tokensToNumber,
} from "../../../../utilities";
import { LockupTableRow } from "./LockupTableRow";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { Arrow } from "../../commons/Arrow";
import { EcoIcon } from "../../commons/icon/EcoIcon";

interface LockupRowProps {
  lockup: FundsLockupWithDeposit;

  onClick(): void;
}

enum LockupStatus {
  Active,
  Complete,
  Withdrawn,
  Claimed,
}

function getLockupStatus(lockup: FundsLockupWithDeposit): LockupStatus {
  const claimed = Boolean(lockup.withdrawnAt);
  if (claimed) {
    if (lockup.withdrawnAt.getTime() < lockup.endsAt.getTime())
      return LockupStatus.Withdrawn;
    return LockupStatus.Claimed;
  }
  if (isLockupClaimable(lockup)) return LockupStatus.Complete;
  return LockupStatus.Active;
}

function getProperties(status: LockupStatus): { text: string; color: Color } {
  if (status === LockupStatus.Claimed)
    return { color: "secondary", text: "CLAIMED" };
  if (status === LockupStatus.Withdrawn)
    return { color: "secondary", text: "WITHDRAWN" };
  if (status === LockupStatus.Complete)
    return { color: "active", text: "COMPLETE" };
  return { color: "primary", text: "VESTING" };
}

function formatDate(date: Date): string {
  return moment(date).format("MM.DD.YYYY");
}

export const LockupRow: React.FC<LockupRowProps> = ({ lockup, onClick }) => {
  const dates = getLockupDates(lockup);
  const status = getLockupStatus(lockup);
  const { color, text } = getProperties(status);

  const ended =
    status === LockupStatus.Claimed || status === LockupStatus.Withdrawn;
  const duration =
    status !== LockupStatus.Active
      ? `ENDED ON ${formatDate(dates.end)}`
      : `${formatDate(dates.start)} - ${formatDate(dates.end)}`;

  const amount = lockup.reward.mul(1e9).div((lockup.interest * 1e7).toFixed(0));
  const reward =
    status === LockupStatus.Withdrawn ? lockup.reward.mul(-1) : lockup.reward;
  return (
    <LockupTableRow
      clickable={!ended}
      onClick={() => !ended && onClick()}
      showBg={status === LockupStatus.Complete}
    >
      <td>
        <Row gap="xs" items="center">
          <EcoIcon color={color} width={9} height={9} />
          <Typography variant="body2" color={color}>
            {formatNumber(tokensToNumber(amount))}
          </Typography>
        </Row>
      </td>
      <td>
        <Typography variant="body2" color={color}>
          {formatNumber(tokensToNumber(reward))}
        </Typography>
      </td>
      <td>
        <Typography variant="body2" color={color}>
          {numberFormatter(lockup.interest)}%
        </Typography>
      </td>
      <td>
        <Typography variant="body2" color={color}>
          {text}
        </Typography>
      </td>
      <td align="right">
        <Row gap="sm" items="center" justify="end">
          <Typography variant="body2" color={color}>
            {duration}
          </Typography>
          {!ended ? <Arrow color="primary" /> : null}
        </Row>
      </td>
    </LockupTableRow>
  );
};
