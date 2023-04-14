import { Block } from "./Block";
import { formatNumber, Row, Typography } from "@ecoinc/ecomponents";
import Image from "next/image";
import EcoLogoWhiteOutline from "../../../public/images/eco-logo/eco-logo-white-outline.svg";
import EcoXLogo from "../../../public/images/ecox-logo/ecox-logo.svg";
import React from "react";
import { css } from "@emotion/react";
import { useWallet } from "../../../providers";
import { tokensToNumber } from "../../../utilities";
import { adjustVotingPower } from "../../../utilities/adjustVotingPower";

const lineHeight = css({ lineHeight: 1 });

export const InfoBlocks = () => {
  const { ecoTotalSupply, ecoXTotalSupply } = useWallet();
  return (
    <Row gap="xl">
      <Block
        title="ECO SUPPLY"
        content={
          <Row gap="sm" items="center">
            <Image
              alt="Eco Logo"
              src={EcoLogoWhiteOutline}
              layout="fixed"
              width={18}
              height={18}
            />
            <Typography color="white" variant="h3" css={lineHeight}>
              {formatNumber(tokensToNumber(ecoTotalSupply), false)}
            </Typography>
          </Row>
        }
      />
      <Block
        title="ECOx SUPPLY"
        content={
          <Row gap="sm" items="center">
            <Image
              alt="Ecox Logo"
              src={EcoXLogo}
              layout="fixed"
              width={18}
              height={18}
            />
            <Typography color="white" variant="h3" css={lineHeight}>
              {formatNumber(tokensToNumber(ecoXTotalSupply), false)}
            </Typography>
          </Row>
        }
      />
      <Block
        title="TOTAL VOTING POWER"
        content={
          <Typography color="white" variant="h3" css={lineHeight}>
            {formatNumber(
              tokensToNumber(
                ecoXTotalSupply.add(adjustVotingPower(ecoTotalSupply))
              ),
              false
            )}
          </Typography>
        }
      />
    </Row>
  );
};
