import {
  Column,
  Dialog,
  formatNumber,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { tokensToNumber } from "../../../../utilities";
import { RIClaimBox } from "../../Notifications/RandomInflation/RIClaimBox";
import { RandomInflationClaimRows } from "../../Notifications/RandomInflation/RandomInflationClaimRows";
import React from "react";
import { RandomInflationRecipient } from "../../../../types";
import {
  RandomInflationActionType,
  useRandomInflation,
} from "../../../../providers/RandomInflationProvider";
import { useWallet } from "../../../../providers";
import { WalletActionType } from "../../../../providers/WalletProvider";
import { Zero } from "@ethersproject/constants";
import useResponsiveDialog from "../../../hooks/useResponsiveDialog";

const Content = styled(Column)({ padding: "0 24px" });

export const RandomInflationModal = () => {
  const {
    isModalOpen,
    setModalOpen,
    dispatch,
    actives,
    claimableAmount,
    claimableRandomInflations: claimRIs,
  } = useRandomInflation();
  const dialogStyles = useResponsiveDialog(524);

  const { dispatch: dispatchWallet } = useWallet();

  const onClaimed = (recipient: RandomInflationRecipient) => {
    dispatch({
      type: RandomInflationActionType.Claim,
      recipient: recipient.recipient,
      sequence: recipient.sequenceNumber,
      randomInflationId: recipient.randomInflation.address,
    });
    dispatchWallet({
      type: WalletActionType.IncrementBalance,
      ecoAmount: recipient.randomInflation.reward,
      ecoXAmount: Zero,
    });
  };

  return (
    <Dialog
      isOpen={isModalOpen}
      onRequestClose={() => setModalOpen(false)}
      style={dialogStyles}
    >
      <Column gap="xl">
        <Content gap="lg">
          <Typography variant="h2">Random inflation</Typography>
          <Typography variant="body1">
            You have <b>{formatNumber(tokensToNumber(claimableAmount))} ECO</b>{" "}
            available to claim
            {claimRIs.length > 1
              ? ` from ${claimRIs.length} random inflations.`
              : "."}
          </Typography>
        </Content>
        {actives.length === 1 ? (
          <RIClaimBox recipient={actives[0]} onClaimed={onClaimed} />
        ) : (
          <RandomInflationClaimRows
            claims={actives}
            onClaimed={onClaimed}
            randomInflations={claimRIs}
          />
        )}
      </Column>
    </Dialog>
  );
};
