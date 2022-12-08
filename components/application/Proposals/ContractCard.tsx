import { Card, Column, Grid, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { displayAddress, etherscanURL } from "../../../utilities";
import copy from "copy-to-clipboard";
import { ExternalButton } from "../commons/ExternalButton";
import Skeleton from "react-loading-skeleton";

interface ContractCardProps {
  address?: string;
}

export const ContractCard: React.FC<ContractCardProps> = ({ address }) => {
  return (
    <Card>
      <Grid columns="1fr auto" gap="6px" alignItems="center">
        <Column gap="md">
          <Typography variant="body3" color="secondary">
            CONTRACT ADDRESS
          </Typography>
          {address ? (
            <Column gap="sm">
              <Typography variant="body2">{displayAddress(address)}</Typography>
              <Typography
                link
                href="#"
                color="active"
                variant="body3"
                onClick={() => copy(address)}
              >
                copy address
              </Typography>
            </Column>
          ) : (
            <Skeleton count={2} />
          )}
        </Column>
        {address ? (
          <ExternalButton
            onClick={() =>
              address && window.open(etherscanURL(address, "address"))
            }
          >
            View
          </ExternalButton>
        ) : null}
      </Grid>
    </Card>
  );
};
