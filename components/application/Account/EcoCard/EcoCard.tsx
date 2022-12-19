import React, { useState } from "react";
import { Zero } from "@ethersproject/constants";
import { Column, styled, Typography } from "@ecoinc/ecomponents";
import { useCommunity, useWallet } from "../../../../providers";
import { LockupDepositAlert } from "./LockupDepositAlert";
import { LockupTableRow } from "./LockupTableRow";
import { LockupRow } from "./LockupRow";
import { LockupClaimModal } from "./LockupClaimModal";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";
import { AccountCard } from "../AccountCard";
import EcoLogo from "../../../../public/images/eco-logo/eco-currency-brandmark.svg";
import { LockupClaimAlert } from "./LockupClaimAlert";
import { isLockupClaimable } from "../../../../utilities";

const LockupTable = styled.table({
  "& tr:first-child td": {
    paddingBottom: 24,
  },
  "& tr:not(:first-child) td": {
    paddingTop: 12,
    paddingBottom: 12,
  },
  "& tr td:not(:last-child)": {
    paddingRight: 16,
  },
});

export const EcoCard = () => {
  const { lockup } = useCommunity();
  const { lockups, inflationMultiplier, ...wallet } = useWallet();

  const [selected, setSelected] = useState<FundsLockupWithDeposit["id"]>();

  const amountLocked = lockups
    .reduce((acc, lockup) => acc.add(lockup.amount), Zero)
    .div(inflationMultiplier);

  const selectedLockup = lockups.find((lockup) => lockup.id === selected);
  const claimableLockup = lockups.find(isLockupClaimable);

  return (
    <AccountCard
      title="ECO"
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
        {!lockups.length ? (
          <Typography variant="body1">
            You are not participating in any lockups at this time.
          </Typography>
        ) : (
          <LockupTable>
            <colgroup>
              <col />
              <col />
              <col style={{ width: 93 }} />
              <col style={{ width: 76 }} />
            </colgroup>
            <LockupTableRow>
              <td>
                <Typography variant="subtitle1" color="secondary">
                  DEPOSIT
                </Typography>
              </td>
              <td>
                <Typography variant="subtitle1" color="secondary">
                  REWARD
                </Typography>
              </td>
              <td>
                <Typography variant="subtitle1" color="secondary">
                  INTEREST RATE
                </Typography>
              </td>
              <td>
                <Typography variant="subtitle1" color="secondary">
                  STATUS
                </Typography>
              </td>
              <td align="right">
                <Typography variant="subtitle1" color="secondary">
                  DURATION
                </Typography>
              </td>
            </LockupTableRow>
            {lockups.map((lockupDeposit) => (
              <LockupRow
                key={lockupDeposit.id}
                lockup={lockupDeposit}
                onClick={() => setSelected(lockupDeposit.id)}
              />
            ))}
          </LockupTable>
        )}
      </Column>
      {claimableLockup ? <LockupClaimAlert lockup={claimableLockup} /> : null}
      {lockup ? <LockupDepositAlert lockup={lockup} /> : null}
    </AccountCard>
  );
};
