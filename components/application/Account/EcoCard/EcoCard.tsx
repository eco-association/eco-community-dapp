import React, { useState } from "react";
import Image from "next/image";
import { Zero } from "@ethersproject/constants";
import { Column, formatNumber, Row, Typography } from "@ecoinc/ecomponents";

import { tokensToNumber } from "../../../../utilities";
import EcoLogoBlack from "../../../../public/images/eco-logo/eco-logo-black.svg";
import { useCommunity, useWallet } from "../../../../providers";
import { LockupDepositAlert } from "./LockupDepositAlert";
import { LockupTableRow } from "./LockupTableRow";
import { LockupRow } from "./LockupRow";
import { LockupClaimModal } from "./LockupClaimModal";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { AccountCard } from "../AccountCard";
import EcoLogo from "../../../../public/images/eco-logo/eco-currency-brandmark.svg";

export const EcoCard = () => {
  const { lockup } = useCommunity();
  const { lockups, inflationMultiplier, ...wallet } = useWallet();

  const [selected, setSelected] = useState<FundsLockupWithDeposit["id"]>();

  const amountLocked = lockups
    .reduce((acc, lockup) => acc.add(lockup.amount), Zero)
    .div(inflationMultiplier);

  const selectedLockup = lockups.find((lockup) => lockup.id === selected);

  return (
    <AccountCard
      title="ECO"
      gap="xl"
      logo={EcoLogo}
      balances={[
        { title: "ECO AVAILABLE", balance: wallet.ecoBalance },
        { title: "ECO IN LOCKUP", balance: amountLocked },
      ]}
    >
      {selected && selectedLockup ? (
        <LockupClaimModal
          isOpen
          lockup={selectedLockup}
          onRequestClose={() => setSelected(undefined)}
        />
      ) : null}
      <Column gap="lg">
        {lockups.length ? (
          <LockupTableRow>
            <Typography variant="subtitle1" color="secondary">
              ECO
            </Typography>
            <Typography variant="subtitle1" color="secondary">
              APY
            </Typography>
            <Typography variant="subtitle1" color="secondary">
              STATUS
            </Typography>
            <Typography variant="subtitle1" color="secondary">
              DURATION
            </Typography>
          </LockupTableRow>
        ) : (
          <Typography variant="body1">
            You are not participating in any lockups at this time.
          </Typography>
        )}
      </Column>
      {lockups.map((lockupDeposit) => (
        <LockupRow
          key={lockupDeposit.id}
          lockup={lockupDeposit}
          onClick={() => setSelected(lockupDeposit.id)}
        />
      ))}
      {lockup ? <LockupDepositAlert lockup={lockup} /> : null}
    </AccountCard>
  );
};
