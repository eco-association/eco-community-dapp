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

  const onClaimed = (recipient: RandomInflationRecipient) => {
    dispatch({
      type: RandomInflationActionType.Claim,
      recipient: recipient.recipient,
      sequence: recipient.sequenceNumber,
      randomInflationId: recipient.randomInflation.address,
    });
  };

  return (
    <Dialog isOpen={isModalOpen} onRequestClose={() => setModalOpen(false)}>
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
