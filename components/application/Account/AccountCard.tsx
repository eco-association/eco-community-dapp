import React from "react";
import { BigNumber } from "ethers";
import {
  Card,
  Column,
  ColumnProps,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import Image, { ImageProps } from "next/image";
import { css } from "@emotion/react";
import { tokensToNumber } from "../../../utilities";

const textRight = css({ textAlign: "right", lineHeight: 1 });

interface AccountCardProps {
  title: string;
  logo?: ImageProps["src"];
  gap?: ColumnProps["gap"];
  balances?: { title: string; balance: BigNumber }[];
  right?: React.ReactNode;
}

export const AccountCard: React.FC<
  React.PropsWithChildren<AccountCardProps>
> = ({ title, logo, right, children, gap = "lg", balances = [] }) => {
  return (
    <Card>
      <Column gap="xl">
        <Row justify="space-between">
          <Row items="center" gap="sm">
            {logo ? (
              <Image src={logo} alt={title} width={24} height={24} />
            ) : null}
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
          {right}
        </Row>
        <Column gap={gap}>
          <hr />
          {children}
        </Column>
      </Column>
    </Card>
  );
};
