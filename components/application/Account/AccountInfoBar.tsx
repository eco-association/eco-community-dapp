import React from "react";
import { Row, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { Block } from "../CommunityGovernance/Block";
import Image from "next/image";
import EcoLogoWhiteOutline from "../../../public/images/eco-logo/eco-logo-white-outline.svg";
import EcoXLogo from "../../../public/images/ecox-logo/ecox-logo.svg";
import { useCommunity } from "../../../providers";
import { useVotingPower } from "../../hooks/useVotingPower";
import { tokensToNumber } from "../../../utilities";
import { WalletInterface } from "../../../types";
import Tooltip from "rc-tooltip";
import informationI from "../../../public/images/information-i.svg";

interface AccountInfoBarProps {
  balances: WalletInterface;
}

const formatterMax2Decimals = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const lineHeight = css({ lineHeight: 1 });

const AccountInfoBar: React.FC<AccountInfoBarProps> = ({ balances }) => {
  const community = useCommunity();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );

  return (
    <Row gap="xl" css={{ marginTop: "28px" }}>
      <Block
        title="YOUR ECO"
        content={
          <Row gap="sm" items="center">
            <Image
              alt="Eco Logo"
              src={EcoLogoWhiteOutline}
              layout="fixed"
              width={18}
              height={18}
            />
            <Typography variant="h3" color="white" css={lineHeight}>
              {formatterMax2Decimals.format(
                tokensToNumber(balances.ecoBalance)
              )}
            </Typography>
          </Row>
        }
      />
      <Block
        title="YOUR ECOX"
        content={
          <Row gap="sm" items="center">
            <Image
              alt="Ecox Logo"
              src={EcoXLogo}
              layout="fixed"
              width={18}
              height={18}
            />
            <Typography variant="h3" color="white" css={lineHeight}>
              {formatterMax2Decimals.format(
                tokensToNumber(balances.ecoXBalance.add(balances.sEcoXBalance))
              )}
            </Typography>
          </Row>
        }
      />
      <Block
        title="YOUR ACTIVE VOTING POWER"
        content={
          <Row gap="md" items="center" justify="space-between">
            <Typography variant="h3" color="white" css={lineHeight}>
              {formatterMax2Decimals.format(
                tokensToNumber(currentGenVotingPower)
              )}
            </Typography>
            <Tooltip
              placement="right"
              trigger="hover"
              overlayInnerStyle={{ overflow: "auto" }}
              overlayStyle={{
                padding: "3px 6px",
                width: "220px",
              }}
              overlay={
                <Typography variant="subtitle1" color="white">
                  Active voting power is the sum of your ECO and staked ECOx
                  voting power, and will update at the beginning of each new
                  generation.
                </Typography>
              }
            >
              <Image src={informationI} alt="" width={12} height={12} />
            </Tooltip>
          </Row>
        }
      />
    </Row>
  );
};

export default AccountInfoBar;
