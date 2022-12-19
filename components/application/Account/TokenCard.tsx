import React from "react";
import { BigNumber } from "ethers";
import {
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import Image, { ImageProps } from "next/image";
import { css } from "@emotion/react";
import { tokensToNumber } from "../../../utilities";

const textRight = css({ textAlign: "right", lineHeight: 1 });

interface TokenCardProps {
  logo: ImageProps["src"];
  title: string;
  balances: { title: string; balance: BigNumber }[];
}

export const TokenCard: React.FC<React.PropsWithChildren<TokenCardProps>> = ({
  title,
  logo,
  balances,
  children,
}) => {
  return (
    <Card>
      <Column gap="xl">
        <Row justify="space-between">
          <Row items="center" gap="sm">
            <Image src={logo} alt={title} width={24} height={24} />
            <Typography variant="h3">{title}</Typography>
          </Row>

          <Row gap="xl">
            {balances.map((item) => (
              <Column key={item.title} gap="md">
                <Typography
                  variant="subtitle1"
                  color="secondary"
                  css={textRight}
                >
                  {item.title}
                </Typography>
                <Typography variant="h5" css={textRight}>
                  {formatNumber(tokensToNumber(item.balance))}
                </Typography>
              </Column>
            ))}
          </Row>
        </Row>
        <Column gap="lg">
          <hr />
          {children}
        </Column>
      </Column>
    </Card>
  );
};
