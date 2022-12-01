import React from "react";
import { Column, Row, styled, Typography } from "@ecoinc/ecomponents";
import { Blockie } from "./Blockie";
import { displayAddress } from "../../../utilities";
import { useENS } from "../../hooks/useENS";
import Skeleton from "react-loading-skeleton";

interface WalletBlockProps {
  address?: string;
}

const TextContainer = styled(Column)({
  "& [aria-live='polite']": {
    lineHeight: 0,
  },
});

export const WalletBlock: React.FC<WalletBlockProps> = ({ address }) => {
  const ens = useENS(address);

  const _addressText = address ? (
    <Typography variant="body3" color="success">
      {displayAddress(address)}
    </Typography>
  ) : (
    <Skeleton height={8} width={80} />
  );

  const _ens = ens ? (
    <Typography variant="body2" color="white">
      {ens}
    </Typography>
  ) : !address ? (
    <Skeleton height={8} width={80} />
  ) : null;

  return (
    <Row gap="md" items="center">
      <Blockie address={address} />
      <TextContainer items="center" gap="md">
        {_ens}
        {_addressText}
      </TextContainer>
    </Row>
  );
};
