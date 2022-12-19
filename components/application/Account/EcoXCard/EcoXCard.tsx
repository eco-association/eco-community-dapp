import { Button, Grid, Typography } from "@ecoinc/ecomponents";
import { useEffect, useState } from "react";
import { useWallet } from "../../../../providers";
import StakingModal from "./StakingModal";
import ConvertModal from "./ConvertModal";
import useConvertECOX from "../../../hooks/useConvertECOX";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import { useAccount } from "wagmi";
import EcoLogo from "../../../../public/images/ecox-logo/ecox-currency-brandmark.svg";
import { css } from "@emotion/react";
import { TokenCard } from "../TokenCard";

const textRight = css({ textAlign: "right", lineHeight: 1 });
const button = css({ padding: "10px 16px", minWidth: "initial" });

const EcoXCard = () => {
  const wallet = useWallet();
  const { isConnected } = useAccount();
  const { getValueOfEcoX } = useConvertECOX();
  const { preventUnauthenticatedActions } = useConnectContext();

  const [ratio, setRatio] = useState(Zero);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  useEffect(() => {
    getValueOfEcoX(WeiPerEther).then(setRatio);
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
    <TokenCard
      title="ECOx"
      logo={EcoLogo}
      balances={[
        {
          title: "YOUR ECOX",
          balance: wallet.ecoXBalance.add(wallet.sEcoXBalance),
        },
        {
          title: "STAKED ECOX",
          balance: wallet.sEcoXBalance,
        },
      ]}
    >
      <ConvertModal
        ecoXBalance={wallet.ecoXBalance}
        exchangeRate={ratio}
        open={convertOpen}
        onClose={() => setConvertOpen(false)}
      />
      <StakingModal open={stakeOpen} setOpen={setStakeOpen} balances={wallet} />
      <Grid columns="1fr auto auto" gap="16px" alignItems="center">
        <Typography variant="body2" color="secondary">
          Stake ECOx to count towards voting power. Or convert your ECOx to ECO
          anytime.
        </Typography>
        <Button
          variant="outline"
          color="secondary"
          css={button}
          onClick={openStaking}
        >
          Manage Staking
        </Button>
        <Button
          variant="outline"
          color="secondary"
          css={button}
          onClick={openConvertModal}
        >
          Convert
        </Button>
      </Grid>
    </TokenCard>
  );
};

export default EcoXCard;
