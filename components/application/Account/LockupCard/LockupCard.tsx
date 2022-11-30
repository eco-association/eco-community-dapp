import React from "react";
import Image from "next/image";
import Tooltip from "rc-tooltip";
import { WeiPerEther } from "@ethersproject/constants";
import {
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";

import { tokensToNumber } from "../../../../utilities";
import informationI from "../../../../public/images/information-i.svg";
import EcoLogoBlack from "../../../../public/images/eco-logo/eco-logo-black.svg";
import { useCommunity, useWallet } from "../../../../providers";
import { LockupDepositAlert } from "../../CommunityGovernance/MonetaryPolicyCard/LockupAlert/LockupDepositAlert";
import { LockupTableRow } from "./LockupTableRow";
import { LockupRow } from "./LockupRow";

export const LockupCard = () => {
  const amountLocked = WeiPerEther;

  const { lockup } = useCommunity();
  const { lockups } = useWallet();

  return (
    <Card>
      <Column gap="xl">
        <Column gap="lg">
          <Row items="start" justify="space-between">
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
            <Tooltip
              placement="left"
              trigger="hover"
              overlayStyle={{
                padding: "3px 6px",
                width: "220px",
              }}
              overlay={
                <Typography variant="subtitle1" color="white">
                  ECOx must be staked in order to count toward voting power.
                </Typography>
              }
            >
              <Image src={informationI} alt="" />
            </Tooltip>
          </Row>
          {lockup ? <LockupDepositAlert lockup={lockup} /> : null}
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
        </Column>
        {lockups.map((lockupDeposit) => (
          <LockupRow key={lockupDeposit.id} lockup={lockupDeposit} />
        ))}
      </Column>
    </Card>
  );
};
