import React, { useState } from "react";
import { ManageDelegationState } from "./provider/ManageDelegationProvider";
import {
  Button,
  Column,
  formatNumber,
  Grid,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { tokensToNumber } from "../../../../../utilities";
import { useManageDelegation } from "./hooks/useManageDelegation";
import LoaderAnimation from "../../../Loader";
import { Steps } from "./Steps";
import { useWallet } from "../../../../../providers";
import { Zero } from "@ethersproject/constants";
import { adjustVotingPower } from "../../../../../utilities/adjustVotingPower";

interface DisableDelegationCardProps {
  state: ManageDelegationState;
  onRequestClose: () => void;
}

const ErrorBox = styled(Column)(({ theme }) => ({
  padding: 16,
  borderRadius: 6,
  background: theme.palette.info.bg,
  border: `solid 1px ${theme.palette.info.main}`,
}));

const ActionBox = styled(Column)(() => ({
  padding: 16,
  borderRadius: 6,
  border: "1px solid #DCE9F0",
}));

const InfoBox = styled(Column)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: 12,
  justifyContent: "center",
}));

const DisableDelegationCard: React.FC<DisableDelegationCardProps> = ({
  state,
  onRequestClose,
}) => {
  const wallet = useWallet();
  const { manageBothTokens } = useManageDelegation();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");

  const loading = state.eco.loading || state.secox.loading;
  const hasDelegatedToMe =
    state.eco.delegatesToMe.length || state.secox.delegatesToMe.length;

  const totalDelegated = [
    ...wallet.ecoDelegatedToMe.map((delegate) =>
      adjustVotingPower(delegate.amount)
    ),
    ...wallet.sEcoXDelegatedToMe.map((delegate) => delegate.amount),
  ].reduce((acc, amount) => acc.add(amount), Zero);

  return (
    <Column gap="xl">
      <Column gap="lg" style={{ padding: "0 8px" }}>
        <Typography variant="h2">Manage Voting Delegation</Typography>
        <Typography variant="body1" color="primary">
          Any change takes effect starting next generation.
        </Typography>
        <InfoBox gap="lg">
          <Typography variant="body1">
            <b>{formatNumber(tokensToNumber(totalDelegated), false)} </b>
            <Typography inline color="active">
              <b>• delegated from others</b>
            </Typography>
          </Typography>
        </InfoBox>
      </Column>
      <ActionBox gap="lg">
        <Grid columns="1fr 90px" alignItems="center" gap="24px">
          <Column gap="sm">
            <Typography variant="body2">
              <b>Delegate status </b>
              <Typography variant="body2" color="active">
                <b>• Active</b>
              </Typography>
            </Typography>
            <Typography
              variant="body2"
              color="secondary"
              style={{ lineHeight: "15.73px" }}
            >
              As a delegate, you can receive delegated votes from others, but
              you won&apos;t be able to delegate any you have to anyone else.
            </Typography>
          </Column>
          <Column gap="md" items="right">
            <Button
              size="sm"
              variant="outline"
              color="active"
              disabled={Boolean(hasDelegatedToMe)}
              onClick={() =>
                manageBothTokens(
                  false,
                  false,
                  setStep,
                  setStatus,
                  onRequestClose
                )
              }
            >
              {loading ? <LoaderAnimation /> : "Disable"}
            </Button>
            {loading && (
              <Steps currentStep={step} totalSteps={2} status={status} center />
            )}
          </Column>
        </Grid>
        {hasDelegatedToMe ? (
          <ErrorBox>
            <Typography variant="body2" color="info">
              <b>Note:</b>
            </Typography>
            <Typography variant="body2">
              You cannot stop being a delegate as long as others are delegating
              their voting power to you.
            </Typography>
          </ErrorBox>
        ) : null}
      </ActionBox>
    </Column>
  );
};

export default DisableDelegationCard;
