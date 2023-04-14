import React from "react";
import moment from "moment";
import { Typography } from "@ecoinc/ecomponents";
import { FundsLockup } from "../../../../../types";
import { getLockupDates } from "../../../../../utilities";

interface LockupDescriptionProps {
  lockup: FundsLockup;
}

export const LockupDescription: React.FC<LockupDescriptionProps> = ({
  lockup,
}) => {
  const dates = getLockupDates(lockup);
  const start = moment(dates.start).format("L");
  const end = moment(dates.end).format("L");

  return (
    <Typography variant="body2" color="secondary">
      Lockup lasts from {start} - {end}.
    </Typography>
  );
};
