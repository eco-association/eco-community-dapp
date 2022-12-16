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
import { useWallet } from "../../../../providers";
import { useVotingPowerSources } from "../../../hooks/useVotingPowerSources";
import { useDelegationState } from "./provider/ManageDelegationProvider";

import AdvancedDelegation from "./AdvancedDelegation";
import EnableDelegationScreen from "./EnableDelegationScreen";
import DisableDelegationCard from "./DisableDelegationCard";

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
  const [option, setOption] = useState(Option.None);
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

  return (
    <Dialog
      isOpen={open}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      style={{ card: { width: 540, padding: "40px 24px" } }}
    >
      {openDelegation ? (
        <EnableDelegationScreen back={() => setOpenDelegation(false)} />
      ) : (
        <Column gap="xl">
          <Column gap="xl" style={{ padding: "0 16px" }}>
            <Column gap="lg">
              <Typography variant="h2">Manage Voting Delegation</Typography>

              <Typography variant="body1" color="primary">
                All changes take effect at the start of the next generation.
              </Typography>
              {delegationEnabled && <DisableDelegationCard state={state} />}
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
                  delegate={state.eco.delegate}
                  option={Option.EcoMyWallet}
                />
              </DelegateInputArea>
            )}
          </Column>
        </Column>
      )}
    </Dialog>
  );
};

export default ManageDelegationModal;
