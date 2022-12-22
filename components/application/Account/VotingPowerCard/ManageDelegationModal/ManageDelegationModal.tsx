import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  Column,
  Dialog,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";

import DelegateCard from "./DelegateCard";
import { useDelegationState } from "./provider/ManageDelegationProvider";

import EnableDelegationScreen from "./EnableDelegationScreen";
import DisableDelegationCard from "./DisableDelegationCard";
import AdvancedDelegation from "./AdvancedDelegation";

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

const DelegateInputArea: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <DropdownBoxStyle gap="lg">
      <Grid columns="1fr 16px" gap="8px" style={{ alignItems: "center" }}>
        <Row items="center" gap="sm" style={{ flexWrap: "wrap" }}>
          <Typography variant="body1" color="primary" style={{ lineHeight: 1 }}>
            Delegate your voting power to someone?{" "}
            <Typography inline color="secondary">
              (optional)
            </Typography>
          </Typography>
        </Row>
      </Grid>
      {children}
    </DropdownBoxStyle>
  );
};

const ManageDelegationModal: React.FC<ManageDelegationModal> = ({
  open,
  onRequestClose,
}) => {
  const { state } = useDelegationState();
  const [advanced, setAdvanced] = useState(
    state.eco.enabled !== state.secox.enabled
  );
  const [openDelegation, setOpenDelegation] = useState(false);

  const loading = state.eco.loading || state.secox.loading;
  const delegationEnabled = state.eco.enabled || state.secox.enabled;

  useEffect(() => {
    if (state.eco.enabled !== state.secox.enabled) {
      setAdvanced(true);
    }
  }, [advanced, state.eco.enabled, state.secox.enabled]);

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
      style={{ card: { width: 545, padding: "40px 24px" } }}
    >
      {advanced && <AdvancedDelegation />}
      {openDelegation && !advanced && !delegationEnabled ? (
        <EnableDelegationScreen
          back={() => setOpenDelegation(false)}
          onRequestClose={() => onRequestClose()}
        />
      ) : (
        !advanced && (
          <Column gap="xl">
            <Column gap="xl" style={{ padding: "0 16px" }}>
              <Column gap="lg" style={{ padding: 14 }}>
                <Typography variant="h2">Manage Voting Delegation</Typography>

                <Typography variant="body1" color="primary">
                  All changes take effect at the start of the next generation.
                </Typography>
                {delegationEnabled && (
                  <DisableDelegationCard
                    state={state}
                    onRequestClose={onRequestClose}
                  />
                )}
                {!delegationEnabled && (
                  <Typography variant="body1" color="secondary">
                    Or you can choose to become a delegate and receive voting
                    power from others. (Note that you cannot choose to both
                    delegate your voting power, and be a delegate yourself) Want
                    to receive others votes and{" "}
                    <Typography
                      onClick={() => setOpenDelegation(!openDelegation)}
                      inline
                      variant="h5"
                      color="secondary"
                      css={{ textDecoration: "underline", cursor: "pointer" }}
                    >
                      become a delegate?
                    </Typography>
                  </Typography>
                )}
              </Column>
              {!delegationEnabled && (
                <DelegateInputArea>
                  <DelegateCard
                    setOpenAdvanced={() => setAdvanced(true)}
                    delegate={state.eco.delegate}
                    option={Option.EcoMyWallet}
                    onRequestClose={onRequestClose}
                  />
                </DelegateInputArea>
              )}
            </Column>
          </Column>
        )
      )}
    </Dialog>
  );
};

export default ManageDelegationModal;
