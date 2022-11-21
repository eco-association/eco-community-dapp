import React from "react";
import { Column, Typography } from "@ecoinc/ecomponents";
import { StakeVaultAlert } from "./StakeVaultAlert";
import { FundsLockup } from "../../../../../types";
import { LockupDescription } from "./LockupDescription";

interface LockupAlertContentProps {
  lockups: FundsLockup[];
  current?: FundsLockup;
}

export const LockupAlertContent: React.FC<LockupAlertContentProps> = ({
  lockups,
  current,
}) => {
  if (!current && lockups.length === 1) {
    return <LockupDescription lockup={lockups[0]} />;
  }

  const text =
    lockups.length === 1 ? (
      <Typography variant="body2" color="secondary">
        Stake your ECO to earn rewards from this lockup.
      </Typography>
    ) : (
      <Typography variant="body2" color="secondary">
        Earn ECO by staking it in an available lockup contract.{" "}
        <Typography
          link
          href="https://docs.eco.org/core-concepts/monetary-governance/monetary-policy-levers#3-interest-rate-lockup-contracts"
          variant="body2"
          target="_blank"
          color="secondary"
        >
          <br />
          Learn more
        </Typography>
      </Typography>
    );

  return (
    <Column gap="md">
      {text}
      {current ? <StakeVaultAlert lockup={current} /> : null}
    </Column>
  );
};
