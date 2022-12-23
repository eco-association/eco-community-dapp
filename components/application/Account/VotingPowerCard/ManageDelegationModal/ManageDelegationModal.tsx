import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { Column, Dialog, styled, Typography } from "@ecoinc/ecomponents";

import DelegateCard from "./DelegateCard";
import { useDelegationState } from "./provider/ManageDelegationProvider";

import EnableDelegationScreen from "./EnableDelegationScreen";
import DisableDelegationCard from "./DisableDelegationCard";
import AdvancedDelegation from "./AdvancedDelegation";
import { isAdvancedDelegation } from "../../../../../utilities/votingPower";

export enum Option {
  None,
  EcoMyWallet,
  SEcoXMyWallet,
  Lockup,
}

interface ManageDelegationModal {
  open: boolean;
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
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: "12px 16px",
    borderRadius: "4px",
  })
);

const ManageDelegationModal: React.FC<ManageDelegationModal> = ({
  open,
  onRequestClose,
}) => {
  const { state } = useDelegationState();
  const [advanced, setAdvanced] = useState(isAdvancedDelegation(state));
  const [openDelegation, setOpenDelegation] = useState(false);

  const loading = state.eco.loading || state.secox.loading;
  const delegationEnabled = state.eco.enabled || state.secox.enabled;

  useEffect(() => {
    if (isAdvancedDelegation(state)) {
      setAdvanced(true);
    }
  }, [state]);

  const handleClose = () => {
    onRequestClose();
    setAdvanced(false);
  };

  return (
    <Dialog
      isOpen={open}
      onRequestClose={handleClose}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      style={{
        card: {
          width: 540,
          padding: advanced
            ? "44px 40px"
            : !(openDelegation && !delegationEnabled) && delegationEnabled
            ? "44px 32px 32px 32px"
            : "40px 24px",
        },
      }}
    >
      {advanced ? (
        <AdvancedDelegation onClose={() => setAdvanced(false)} />
      ) : openDelegation && !delegationEnabled ? (
        <EnableDelegationScreen
          back={() => setOpenDelegation(false)}
          onRequestClose={() => onRequestClose()}
        />
      ) : (
        <Column gap="xl">
          <Column
            gap="xl"
            style={{ padding: !delegationEnabled ? "0 16px" : 0 }}
          >
            {delegationEnabled ? (
              <DisableDelegationCard
                state={state}
                onRequestClose={onRequestClose}
              />
            ) : (
              <Column gap="lg">
                <Typography variant="h2">Manage Voting Delegation</Typography>
                <Typography variant="body1" color="primary">
                  All changes take effect at the start of the next generation.
                </Typography>
                <Typography variant="body1" color="secondary">
                  You can delegate your voting power to others, or{" "}
                  <Typography
                    variant="body1"
                    color="secondary"
                    onClick={() => setOpenDelegation(!openDelegation)}
                    css={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    <b>become a delegate</b>
                  </Typography>
                  . (Note that you cannot do both at the same time.)
                </Typography>
              </Column>
            )}
            {!delegationEnabled ? (
              <DropdownBoxStyle gap="lg">
                <Typography
                  variant="body1"
                  color="primary"
                  style={{ lineHeight: 1 }}
                >
                  Delegate your voting power to someone?{" "}
                  <Typography color="secondary">(optional)</Typography>
                </Typography>
                <DelegateCard
                  option={Option.EcoMyWallet}
                  delegate={state.eco.delegate}
                  onRequestClose={onRequestClose}
                  setOpenAdvanced={() => setAdvanced(true)}
                />
              </DropdownBoxStyle>
            ) : null}
          </Column>
        </Column>
      )}
    </Dialog>
  );
};

export default ManageDelegationModal;
