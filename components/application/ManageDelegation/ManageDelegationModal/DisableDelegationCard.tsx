import { useDebugValue, useMemo, useState } from "react";
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
import { tokensToNumber } from "../../../../utilities";
import { useManageDelegation } from "./hooks/useManageDelegation";
import LoaderAnimation from "../../Loader";

interface DisableDelegationCardProps {
  state: ManageDelegationState;
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
}));

const InfoBox = styled(Column)(({ theme }) => ({
  height: 64,
  background: theme.palette.background.paper,
  padding: 12,
  justifyContent: "center",
}));

const DisableDelegationCard: React.FC<DisableDelegationCardProps> = ({
  state,
}) => {
  const { manageBothTokens } = useManageDelegation();
  const [totalDelegatedToMe, setTotalDelegatedToMe] = useState<string>();
  const loading = state.eco.loading || state.secox.loading;
  useMemo(() => {
    const totalBN = Zero;
    state.eco.delegatesToMe?.map((e) => {
      totalBN.add(e.amount);
    });
    state.secox.delegatesToMe?.map((e) => {
      totalBN.add(e.amount);
    });
    setTotalDelegatedToMe(formatNumber(tokensToNumber(totalBN)));
  }, [state]);
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
          <Button
            disabled={hasDelegatedToMe}
            variant="outline"
            color="active"
            css={{ height: 31, padding: 0 }}
            onClick={() => manageBothTokens(false, false)}
          >
            {loading ? <LoaderAnimation /> : "Disable"}
          </Button>
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
