import {
  Button,
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import styled from "@emotion/styled";
import { useMemo, useState } from "react";
import { useWallet } from "../../../providers";
import { tokensToNumber } from "../../../utilities";
import StakingModal from "../Account/StakingModal";
import ConvertModal from "./ConvertModal";

const TopRow = styled(Row)({
  borderBottom: `1px solid #DCE9F0`,
  paddingBottom: 10,
  marginBottom: 19,
});

const StakeOrConvertCard = () => {
  const [ratio, setRatio] = useState<string>();
  const [convertOpen, setConvertOpen] = useState<boolean>(false);
  const [stakeOpen, setStakeOpen] = useState<boolean>(false);

  const wallet = useWallet();
  useMemo(() => {
    const formatter = new Intl.NumberFormat("en-US", {
      minimumSignificantDigits: 1,
      maximumSignificantDigits: 1,
    });
    const r =
      parseInt(wallet.ecoBalance.toString()) /
      parseInt(wallet.ecoXBalance.toString());
    setRatio(`${formatter.format(r)}:1`);
  }, [wallet]);

  return (
    <Card css={{ marginTop: 24 }}>
      <ConvertModal
        ecoXBalance={wallet.ecoXBalance}
        exchangeRate={ratio}
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
          <Typography variant="h2">{ratio}</Typography>
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
