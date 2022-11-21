import { Card, Column, Grid, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { displayAddress, etherscanURL } from "../../../utilities";
import copy from "copy-to-clipboard";
import { ExternalButton } from "../commons/ExternalButton";

interface ContractCardProps {
  address: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({ address }) => {
  return (
    <Card>
      <Grid columns="1fr auto" gap="6px" alignItems="center">
        <Column gap="md">
          <Typography variant="body3" color="secondary">
            CONTRACT ADDRESS
          </Typography>
          <Column gap="sm">
            <Typography variant="body2">{displayAddress(address)}</Typography>
            <Typography
              link
              variant="body3"
              color="active"
              href="#"
              onClick={() => copy(address)}
            >
              copy address
            </Typography>
          </Column>
        </Column>
        <ExternalButton
          onClick={() => window.open(etherscanURL(address, "address"))}
        >
          View
        </ExternalButton>
      </Grid>
    </Card>
  );
};
