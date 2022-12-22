import React, { useMemo, useState } from "react";
import { ManageDelegationState } from "./provider/ManageDelegationProvider";
import { Zero } from "@ethersproject/constants";
import {
  Button,
  Column,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { tokensToNumber } from "../../../../../utilities";
import { useManageDelegation } from "./hooks/useManageDelegation";
import LoaderAnimation from "../../../Loader";
import { Steps } from "./Steps";
import { useVotingPowerSources } from "../../../../hooks/useVotingPowerSources";
import { BigNumber } from "ethers";

interface DisableDelegationCardProps {
  state: ManageDelegationState;
  onRequestClose: () => void;
}

const ErrorBox = styled(Column)(() => ({
  border: "solid 1px #6F8EFF",
  background: "rgba(111, 142, 255, 0.05)",
  borderRadius: 6,
  height: 76,
  padding: "12px 16px",
}));

const ActionBox = styled(Column)(() => ({
  background:
    "linear-gradient(0deg, #FFFFFF, #FFFFFF), rgba(111, 195, 255, 0.05)",
  borderRadius: 6,
  border: "1px solid #DCE9F0",
  padding: 12,
  width: "110%",
  marginLeft: "-20px",
}));

const InfoBox = styled(Column)(({ theme }) => ({
  height: 64,
  background: theme.palette.background.paper,
  padding: 12,
  justifyContent: "center",
}));

const DisableDelegationCard: React.FC<DisableDelegationCardProps> = ({
  state,
  onRequestClose,
}) => {
  const { manageBothTokens } = useManageDelegation();
  const [totalDelegatedToMe, setTotalDelegatedToMe] = useState<string>();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const loading = state.eco.loading || state.secox.loading;
  const sources = useVotingPowerSources();

  useMemo(() => {
    let totalBN = Zero;
    sources.ecoDelegatedToMe?.map((e) => {
      totalBN = totalBN.add(e.amount);
    });
    sources.sEcoXDelegatedToMe?.map((e) => {
      totalBN = totalBN.add(e.amount);
    });
    setTotalDelegatedToMe(formatNumber(tokensToNumber(totalBN)));
  }, [sources]);
  const hasDelegatedToMe =
    state.eco.delegatesToMe.length > 0 || state.secox.delegatesToMe.length > 0;
  return (
    <Column gap="xl">
      <InfoBox gap="lg">
        <Typography variant="body1">
          {totalDelegatedToMe}{" "}
          <Typography inline color="active">
            • delegated from others
          </Typography>
        </Typography>
      </InfoBox>
      <ActionBox gap="lg">
        <Row items="center">
          <Column>
            <Typography variant="h5">
              Delegate status{" "}
              <Typography inline color="active">
                • Active
              </Typography>
            </Typography>
            <Typography variant="body1" color="secondary">
              As a delegate, you can receive delegated votes from others, but
              you won&apos;t be able to delegate any you have to anyone else.
            </Typography>
          </Column>
          <Column gap="md" items="right">
            <Button
              disabled={hasDelegatedToMe}
              variant="outline"
              color="active"
              css={{ height: 31, padding: 0 }}
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
        </Row>
        {hasDelegatedToMe && (
          <ErrorBox>
            <Typography
              variant="body2"
              css={{ color: "#6F8EFF", fontWeight: 700 }}
            >
              Note:
            </Typography>
            <Typography variant="body2">
              You cannot stop being a delegate as long as others are delegating
              their voting power to you.
            </Typography>
          </ErrorBox>
        )}
      </ActionBox>
    </Column>
  );
};

export default DisableDelegationCard;
