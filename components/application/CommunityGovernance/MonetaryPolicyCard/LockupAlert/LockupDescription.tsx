import React from "react";
import moment from "moment";
import { Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { FundsLockup } from "../../../../../types";
import { numberFormatter } from "../../../../../utilities/numberFormatter";

const fontWeight = css({ fontSize: 13, fontWeight: "bold" });
const SECONDS_PER_DAY = 86400000;

function getLockupAPY(lockup: FundsLockup): number {
  return (SECONDS_PER_DAY * 365 * lockup.interest) / lockup.duration;
}

interface LockupDescriptionProps {
  lockup: FundsLockup;
}

export const LockupDescription: React.FC<LockupDescriptionProps> = ({
  lockup,
}) => {
  const {
    depositWindowDuration: depositDuration,
    depositWindowEndsAt: endsAt,
    duration,
  } = lockup;

  const start = moment(endsAt.getTime() - depositDuration).format("L");
  const end = moment(endsAt.getTime() + duration).format("L");
  const APY = numberFormatter(getLockupAPY(lockup));

  return (
    <React.Fragment>
      Earns{" "}
      <Typography variant="body2" css={fontWeight}>
        {APY}% APY.
      </Typography>{" "}
      Lockup lasts from {start} - {end}.
    </React.Fragment>
  );
};
