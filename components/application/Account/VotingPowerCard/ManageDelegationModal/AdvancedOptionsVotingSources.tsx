import React, { useState } from "react";
import {
  Column,
  formatNumber,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { BigNumber } from "ethers";
import { displayAddress, tokensToNumber } from "../../../../../utilities";
import Image from "next/image";
import chevronUp from "../../../../../public/images/chevron-up.svg";
import chevronDown from "../../../../../public/images/chevron-down.svg";
import {
  DelegateValidation,
  useDelegationState,
} from "./provider/ManageDelegationProvider";
import { useWallet } from "../../../../../providers";
import DelegateCard from "./DelegateCard";
import { adjustVotingPower } from "../../../../../utilities/adjustVotingPower";
import { ManageDelegationOption } from "./ManageDelegationModal";

interface DropdownBoxProps {
  open?: boolean;
  amount: BigNumber;
  title: string;
  delegate?: string;
  red?: boolean;

  onToggle(): void;
}

const DropdownBoxStyle = styled(Column)<Pick<DropdownBoxProps, "red">>(
  ({ theme, red }) => ({
    backgroundColor: red ? "#FDF4F4" : theme.palette.background.paper,
    padding: "12px 16px",
    borderRadius: "4px",
  })
);

const DropdownBox: React.FC<React.PropsWithChildren<DropdownBoxProps>> = ({
  open,
  red,
  title,
  amount,
  delegate,
  onToggle,
  children,
}) => {
  return (
    <DropdownBoxStyle red={red} gap="lg">
      <Grid columns="1fr 16px" gap="8px" style={{ alignItems: "center" }}>
        <Row items="center" gap="sm" style={{ flexWrap: "wrap" }}>
          <Typography
            variant="h5"
            color={red ? "error" : "primary"}
            style={{ lineHeight: 1 }}
          >
            {formatNumber(tokensToNumber(amount), false)}
          </Typography>
          <Typography
            variant="h5"
            color={red ? "error" : "active"}
            style={{ lineHeight: 1 }}
          >
            &#x2022; {title}
          </Typography>
          {delegate ? (
            <Typography
              variant="h5"
              color={red ? "error" : "secondary"}
              style={{ lineHeight: 1 }}
            >
              &#x2022; delegated to {displayAddress(delegate)}
            </Typography>
          ) : null}
        </Row>
        {children && (
          <Image
            alt=""
            onClick={onToggle}
            css={{ cursor: "pointer" }}
            src={open ? chevronUp : chevronDown}
          />
        )}
      </Grid>
      {open && children}
    </DropdownBoxStyle>
  );
};

const AdvancedOptionsVotingSources: React.FC = () => {
  const { state } = useDelegationState();
  const { ecoBalance, sEcoXBalance } = useWallet();

  const [option, setOption] = useState(ManageDelegationOption.None);

  const handleDropdownClick = (option: ManageDelegationOption) =>
    setOption(option);

  const loading = state.eco.loading || state.secox.loading;

  return (
    <Column gap="xl">
      <DropdownBox
        title="ECO from your wallet"
        amount={adjustVotingPower(ecoBalance)}
        delegate={state.eco.delegate}
        red={state.eco.validate === DelegateValidation.Confirm}
        open={
          option === ManageDelegationOption.EcoMyWallet &&
          state.eco.validate !== DelegateValidation.Confirm
        }
        onToggle={() =>
          handleDropdownClick(
            option === ManageDelegationOption.EcoMyWallet
              ? ManageDelegationOption.None
              : ManageDelegationOption.EcoMyWallet
          )
        }
      >
        {!state.eco.enabled && !loading && (
          <DelegateCard
            delegate={state.eco.delegate}
            option={ManageDelegationOption.EcoMyWallet}
          />
        )}
      </DropdownBox>
      <DropdownBox
        title="staked ECOx from your wallet"
        amount={sEcoXBalance}
        delegate={state.secox.delegate}
        red={state.secox.validate === DelegateValidation.Confirm}
        open={
          option === ManageDelegationOption.SEcoXMyWallet &&
          state.secox.validate !== DelegateValidation.Confirm
        }
        onToggle={() =>
          handleDropdownClick(
            option === ManageDelegationOption.SEcoXMyWallet
              ? ManageDelegationOption.None
              : ManageDelegationOption.SEcoXMyWallet
          )
        }
      >
        {!state.secox.enabled && !loading && (
          <DelegateCard
            delegate={state.secox.delegate}
            option={ManageDelegationOption.SEcoXMyWallet}
          />
        )}
      </DropdownBox>
    </Column>
  );
};

export default AdvancedOptionsVotingSources;
