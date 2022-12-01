import React, { useState } from "react";
import Image from "next/image";
import { Zero } from "@ethersproject/constants";
import {
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";

import { tokensToNumber } from "../../../../utilities";
import EcoLogoBlack from "../../../../public/images/eco-logo/eco-logo-black.svg";
import { useCommunity, useWallet } from "../../../../providers";
import { LockupDepositAlert } from "./LockupDepositAlert";
import { LockupTableRow } from "./LockupTableRow";
import { LockupRow } from "./LockupRow";
import { LockupClaimModal } from "./LockupClaimModal";
import { FundsLockupWithDeposit } from "../../../../types/FundsLockup";

export const LockupCard = () => {
  const { lockup } = useCommunity();
  const { lockups, inflationMultiplier } = useWallet();

  const [selected, setSelected] = useState<FundsLockupWithDeposit>();

  const amountLocked = lockups
    .reduce((acc, lockup) => acc.add(lockup.amount), Zero)
    .div(inflationMultiplier);

  return (
    <Card>
      <Column gap="xl">
        <Column gap="lg">
          <Column gap="md">
            <Typography variant="subtitle1" color="secondary">
              LOCKUP
            </Typography>
            <Row gap="md" items="center">
              <Image
                alt="eco token"
                src={EcoLogoBlack}
                layout="fixed"
                width={18}
                height={18}
              />
              <Typography variant="h2" style={{ lineHeight: 1 }}>
                {formatNumber(tokensToNumber(amountLocked))}
              </Typography>
            </Row>
          </Column>
          {lockup ? <LockupDepositAlert lockup={lockup} /> : null}
          {lockups.length ? (
            <Column gap="md">
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
              <hr />
            </Column>
          ) : null}
        </Column>
        {lockups.map((lockupDeposit) => (
          <LockupRow
            key={lockupDeposit.id}
            lockup={lockupDeposit}
            onClick={() => setSelected(lockupDeposit)}
          />
        ))}
        {selected ? (
          <LockupClaimModal
            isOpen
            lockup={selected}
            onRequestClose={() => setSelected(undefined)}
          />
        ) : null}
      </Column>
    </Card>
  );
};
