import React, { useMemo } from "react";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import useLockups from "../../../../hooks/useLockups";
import { LockupAlertContent } from "./LockupAlertContent";

const fontWeight = css({ fontWeight: "bold", color: "#128264" });

const formatter = new Intl.NumberFormat("en-US", {
  minimumSignificantDigits: 1,
  maximumSignificantDigits: 3,
});

export const LockupAlert = () => {
  const { active, current, lockups } = useLockups();
  const totalAPY = useMemo(() => {
    return lockups.reduce((acc, lockup) => lockup.interest + acc, 0);
  }, [lockups]);

  if (!active.length)
    return (
      <Alert css={{ border: 0 }} color="secondary" title="Lockups • Inactive">
        <Typography variant="body2" color="secondary">
          Deposit your ECO into a lockup to earn interest.
        </Typography>
      </Alert>
    );

  return (
    <Alert
      color="transparent"
      title={
        <Typography variant="body1" css={fontWeight}>
          Base Interest Rate * {formatter.format(totalAPY)}%
        </Typography>
      }
    >
      <LockupAlertContent current={current} lockups={active} />
    </Alert>
  );
};
