import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  Column,
  Dialog,
  formatNumber,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import moment from "moment";
import Image from "next/image";
import { css } from "@emotion/react";

import DelegateCard from "./DelegateCard";
import EnableDelegationBox from "./EnableDelegationBox";
import { displayAddress, tokensToNumber } from "../../../../utilities";
import { useWallet } from "../../../../providers";
import { useVotingPowerSources } from "../../../hooks/useVotingPowerSources";
import {
  DelegateValidation,
  useDelegationState,
} from "./provider/ManageDelegationProvider";

import chevronDown from "../../../../public/images/chevron-down.svg";
import chevronUp from "../../../../public/images/chevron-up.svg";
import AdvancedDelegation from "./AdvancedDelegation";

export enum Option {
  None,
  EcoMyWallet,
  SEcoXMyWallet,
  Lockup,
}

interface ManageDelegationModal {
  open: boolean;
  votingPower: BigNumber;
  currentGenVotingPower: BigNumber;
  onRequestClose: () => void;
}

interface DropdownBoxProps {
  open: boolean;
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
            color={red ? "error" : "primary"}
            css={red ? {} : darkGreenColor}
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

const darkGreenColor = css({ color: "#128264" });

const ManageDelegationModal: React.FC<ManageDelegationModal> = ({
  open,
  votingPower,
  currentGenVotingPower,
  onRequestClose,
}) => {
  const sources = useVotingPowerSources();
  const { state } = useDelegationState();
  const { ecoBalance, sEcoXBalance } = useWallet();

  const [option, setOption] = useState(Option.None);
  const [advanced, setAdvanced] = useState(
    state.eco.enabled !== state.secox.enabled
  );
  const [selectedLockup, setSelectedLockup] = useState<string>(null);

  const handleDropdownClick = (option: Option) => setOption(option);

  const loading = state.eco.loading || state.secox.loading;

  useEffect(() => {
    if (state.eco.enabled !== state.secox.enabled) {
      setAdvanced(true);
    }
  }, [advanced, state.eco.enabled, state.secox.enabled]);

  return (
    <Dialog
      isOpen={open}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      style={{ card: { maxWidth: 540, padding: "40px 24px" } }}
    >
      <Column gap="xl">
        <Column gap="xl" style={{ padding: "0 16px" }}>
          <Column gap="lg" style={{ padding: "0 16px" }}>
            <Typography variant="h2">Manage Delegation</Typography>
            <Typography variant="body1">
              You have {formatNumber(tokensToNumber(votingPower), false)} Total
              Voting Power,{" "}
              <span style={{ fontWeight: "700" }}>
                {formatNumber(tokensToNumber(currentGenVotingPower), false)} is
                active this generation.
              </span>
            </Typography>
          </Column>
          <DropdownBox
            title="ECO from your wallet"
            amount={ecoBalance}
            delegate={state.eco.delegate}
            red={state.eco.validate === DelegateValidation.Confirm}
            open={
              option === Option.EcoMyWallet &&
              state.eco.validate !== DelegateValidation.Confirm
            }
            onToggle={() =>
              handleDropdownClick(
                option === Option.EcoMyWallet ? Option.None : Option.EcoMyWallet
              )
            }
          >
            {!state.eco.enabled && !loading && (
              <DelegateCard
                delegate={state.eco.delegate}
                option={Option.EcoMyWallet}
              />
            )}
          </DropdownBox>
          <DropdownBox
            title="sECOx from your wallet"
            amount={sEcoXBalance.mul(10)}
            delegate={state.secox.delegate}
            red={state.secox.validate === DelegateValidation.Confirm}
            open={
              option === Option.SEcoXMyWallet &&
              state.secox.validate !== DelegateValidation.Confirm
            }
            onToggle={() =>
              handleDropdownClick(
                option === Option.SEcoXMyWallet
                  ? Option.None
                  : Option.SEcoXMyWallet
              )
            }
          >
            {!state.secox.enabled && !loading && (
              <DelegateCard
                delegate={state.secox.delegate}
                option={Option.SEcoXMyWallet}
              />
            )}
          </DropdownBox>
          {sources.fundsLockedUp.map((lockup) => (
            <DropdownBox
              key={lockup.id}
              title={`ECO from Lockup ending ${moment(lockup.endsAt).format(
                "L"
              )}`}
              open={option === Option.Lockup && selectedLockup === lockup.id}
              amount={lockup.amount}
              delegate={lockup.delegate}
              onToggle={() => {
                setSelectedLockup(lockup.id);
                handleDropdownClick(
                  option === Option.Lockup ? Option.None : Option.Lockup
                );
              }}
            >
              {!state.eco.enabled && !loading && (
                <DelegateCard
                  lockup={lockup.id}
                  delegate={lockup.delegate}
                  option={Option.Lockup}
                />
              )}
            </DropdownBox>
          ))}

          <hr />

          {!advanced && state.eco.enabled === state.secox.enabled ? (
            <EnableDelegationBox onOpen={() => setAdvanced(true)} />
          ) : (
            <AdvancedDelegation onClose={() => setAdvanced(false)} />
          )}
        </Column>
      </Column>
    </Dialog>
  );
};

export default ManageDelegationModal;
