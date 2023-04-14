import { Button, Column, Row, styled, Typography } from "@ecoinc/ecomponents";
import { useEffect, useState } from "react";
import { useWallet } from "../../../../providers";
import StakingModal from "./StakingModal";
import ConvertModal from "./ConvertModal";
import useConvertECOX from "../../../hooks/useConvertECOX";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import { useAccount } from "wagmi";
import EcoXLogo from "../../../../public/images/ecox-logo/ecox-currency-brandmark.svg";
import { css } from "@emotion/react";
import { AccountCard } from "../AccountCard";

const button = css({ padding: "10px 16px", minWidth: "initial" });

const Box = styled(Row)(({ theme }) => ({
  padding: 8,
  backgroundColor: theme.palette.secondary.bg,
}));

const EcoXCard = () => {
  const wallet = useWallet();
  const { isConnected } = useAccount();
  const { getValueOfEcoX } = useConvertECOX();
  const { preventUnauthenticatedActions } = useConnectContext();

  const [ratio, setRatio] = useState(Zero);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  useEffect(() => {
    getValueOfEcoX(WeiPerEther).then((ratio) => {
      if (!ratio.isZero()) setRatio(ratio);
    });
  }, [getValueOfEcoX]);

  const openStaking = () => {
    if (!isConnected) return preventUnauthenticatedActions();
    setStakeOpen(true);
  };

  const openConvertModal = () => {
    if (!isConnected) return preventUnauthenticatedActions();
    setConvertOpen(true);
  };

  return (
    <AccountCard
      title="ECOx"
      logo={EcoXLogo}
      balances={[
        {
          title: "UNSTAKED ECOX",
          balance: wallet.ecoXBalance,
        },
        {
          title: "STAKED ECOX",
          balance: wallet.sEcoXBalance,
        },
      ]}
    >
      {convertOpen ? (
        <ConvertModal
          open={convertOpen}
          exchangeRate={ratio}
          ecoXBalance={wallet.ecoXBalance}
          onClose={() => setConvertOpen(false)}
        />
      ) : null}
      {stakeOpen ? (
        <StakingModal
          open={stakeOpen}
          setOpen={setStakeOpen}
          balances={wallet}
        />
      ) : null}
      <Column gap="lg">
        <Row items="center" justify="space-between" gap="lg">
          <Typography variant="body2" color="secondary">
            Stake ECOx to count towards voting power.
          </Typography>
          <Button
            variant="outline"
            color="secondary"
            css={button}
            onClick={openStaking}
          >
            Manage Staking
          </Button>
        </Row>
        <Box items="center" justify="space-between" style={{ gap: 44 }}>
          <Typography variant="body2" color="secondary">
            You can also burn your ECOx to convert them to ECO at anytime. Note:
            This action is irreversible.
          </Typography>
          <Button
            variant="outline"
            color="secondary"
            css={button}
            onClick={openConvertModal}
          >
            Convert
          </Button>
        </Box>
      </Column>
    </AccountCard>
  );
};

export default EcoXCard;
