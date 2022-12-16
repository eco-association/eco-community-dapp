import { useMemo, useState } from "react";
import { TokenDelegation } from "./provider/ManageDelegationProvider";
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

interface DisableDelegationCardProps {
  state: any;
}

const ActionBox = styled(Row)(({ theme }) => ({
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

  useMemo(() => {
    const totalBN = Zero;
    state.delegatesToMe?.map((e) => {
      totalBN.add(e.amount);
    });
    setTotalDelegatedToMe(formatNumber(tokensToNumber(totalBN)));
  }, [state]);
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
      <ActionBox items="center" gap="lg">
        <Column>
          <Typography variant="h5">
            Delegate status{" "}
            <Typography inline color="active">
              • Active
            </Typography>
          </Typography>
          <Typography variant="body1" color="secondary">
            As a delegate, you can receive delegated votes from others, but you
            won&apos;t be able to delegate any you have to anyone else.
          </Typography>
        </Column>
        <Button
          variant="outline"
          color="active"
          css={{ height: 31, padding: 0 }}
          onClick={() => manageBothTokens(false, false)}
        >
          Disable
        </Button>
      </ActionBox>
    </Column>
  );
};

export default DisableDelegationCard;
