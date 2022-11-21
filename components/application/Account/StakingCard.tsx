import {
  Button,
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { useConnectContext } from "../../../providers/ConnectModalProvider";
import StakingModal from "./StakingModal";
import { tokensToNumber } from "../../../utilities";
import { WalletInterface } from "../../../types";
import Tooltip from "rc-tooltip";
import informationI from "../../../public/images/information-i.svg";
import Image from "next/image";

interface StakingCardProps {
  balances: WalletInterface;
}

const StakingCard: React.FC<StakingCardProps> = ({ balances }) => {
  const { preventUnauthenticatedActions } = useConnectContext();
  const { isConnected } = useAccount();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      {open && (
        <StakingModal open={open} setOpen={setOpen} balances={balances} />
      )}
      <Column gap="xl">
        <Column gap="lg">
          <Row items="start" justify="space-between">
            <Column gap="md">
              <Typography variant="subtitle1" color="secondary">
                STAKED ECOX
              </Typography>
              <Typography variant="h2" style={{ lineHeight: 1 }}>
                {formatNumber(tokensToNumber(balances.sEcoXBalance), false)}
              </Typography>
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
          <hr />
        </Column>
        <Column gap="lg" items="start">
          <Typography variant="body1" color="secondary">
            Stake or unstake your ECOx.
          </Typography>
          <Button
            variant="outline"
            color="secondary"
            onClick={() => {
              if (!isConnected) return preventUnauthenticatedActions();
              setOpen(true);
            }}
          >
            Manage Staking
          </Button>
        </Column>
      </Column>
    </Card>
  );
};

export default StakingCard;
