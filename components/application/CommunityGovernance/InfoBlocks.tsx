import { Block } from "./Block";
import {
  formatNumber,
  pxToRem,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import Image from "next/image";

import EcoLogoWhiteOutline from "../../../public/images/eco-logo/eco-logo-white-outline.svg";
import EcoXLogo from "../../../public/images/ecox-logo/ecox-logo.svg";
import { css } from "@emotion/react";
import { useWallet } from "../../../providers";
import { breakpoints, mq, tokensToNumber } from "../../../utilities";
import { adjustVotingPower } from "../../../utilities/adjustVotingPower";

const lineHeight = css({ lineHeight: 1 });

const InfoBlocksContainer = styled(Row)({
  flexDirection: "column",
  gap: "8px",
  [mq(breakpoints.sm)]: {
    gap: "24px",
    flexDirection: "row",
  },
});

const Tokens = styled(Typography)({
  fontSize: pxToRem(13),
  [mq(breakpoints.md)]: {
    fontSize: pxToRem(20),
  },
});

export const InfoBlocks = () => {
  const { ecoTotalSupply, ecoXTotalSupply } = useWallet();

  return (
    <InfoBlocksContainer>
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
            <Tokens color="white" variant="h3" css={lineHeight}>
              {formatNumber(tokensToNumber(ecoTotalSupply), false)}
            </Tokens>
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
            <Tokens color="white" variant="h3" css={lineHeight}>
              {formatNumber(tokensToNumber(ecoXTotalSupply), false)}
            </Tokens>
          </Row>
        }
      />
      <Block
        title="TOTAL VOTING POWER"
        content={
          <Tokens color="white" variant="h3" css={lineHeight}>
            {formatNumber(
              tokensToNumber(
                ecoXTotalSupply.add(adjustVotingPower(ecoTotalSupply))
              ),
              false
            )}
          </Tokens>
        }
      />
    </InfoBlocksContainer>
  );
};
