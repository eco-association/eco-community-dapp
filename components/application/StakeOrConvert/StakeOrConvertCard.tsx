import {
  Button,
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useWallet } from "../../../providers";
import { tokensToNumber } from "../../../utilities";
import StakingModal from "../Account/StakingModal";
import ConvertModal from "./ConvertModal";
import useConvertECOX from "../../hooks/useConvertECOX";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { BigNumber } from "ethers";

const TopRow = styled(Row)({
  borderBottom: `1px solid #DCE9F0`,
  paddingBottom: 8,
  marginBottom: 16,
});

const StakeOrConvertCard = () => {
  const wallet = useWallet();

  const [ratio, setRatio] = useState(Zero);
  const [stakeOpen, setStakeOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);

  const { getValueOfEcoX } = useConvertECOX();

  useEffect(() => {
    //getValueOfEcoX(WeiPerEther).then(setRatio);
  }, [getValueOfEcoX]);

  const _ratio = ratio.isZero()
    ? "Calculating..."
    : `${formatNumber(tokensToNumber(BigNumber.from("1")))}:1`;

  return (
    <Card>
      <ConvertModal
        ecoXBalance={wallet.ecoXBalance}
        exchangeRate={_ratio}
        open={convertOpen}
        setOpen={setConvertOpen}
      />
      <StakingModal open={stakeOpen} setOpen={setStakeOpen} balances={wallet} />
      <TopRow>
        <Column>
          <Typography variant="subtitle1" color="secondary">
            ECOX
          </Typography>
          <Typography variant="h2" css={{ marginRight: 50 }}>
            {formatNumber(tokensToNumber(wallet.ecoXBalance), false)}
          </Typography>
        </Column>
        <Column>
          <Typography variant="subtitle1" color="secondary">
            ECO-ECOX RATE
          </Typography>
          <Typography variant="h2">{_ratio}</Typography>
        </Column>
      </TopRow>
      <Typography variant="body2" color="secondary">
        Only your staked ECOx counts towards your voting power, and only your
        unstaked ECOx can be converted into ECO.
      </Typography>
      <Row css={{ paddingTop: 8 }}>
        <Button
          variant="outline"
          color="secondary"
          css={{ marginRight: 16 }}
          onClick={() => setStakeOpen(true)}
        >
          Manage Staking
        </Button>
        <Button
          variant="outline"
          color="secondary"
          onClick={() => setConvertOpen(true)}
        >
          Convert
        </Button>
      </Row>
    </Card>
  );
};

export default StakeOrConvertCard;
