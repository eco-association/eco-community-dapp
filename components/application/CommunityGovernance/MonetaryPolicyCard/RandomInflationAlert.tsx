import React from "react";
import { ethers } from "ethers";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { useCommunity, useWallet } from "../../../../providers";
import { numberFormatter } from "../../../../utilities";

export const RandomInflationAlert = () => {
  const { randomInflation } = useCommunity();
  const { ecoTotalSupply } = useWallet();

  if (!randomInflation)
    return (
      <Alert
        css={{ border: 0 }}
        color="secondary"
        title={
          <Typography variant="body2" color="secondary">
            <b>Random Inflation • Inactive</b>
          </Typography>
        }
      >
        <Typography variant="body2" color="secondary">
          There is no random inflation this generation.
        </Typography>
      </Alert>
    );

  const rewards = parseFloat(
    ethers.utils.formatUnits(
      randomInflation.reward.mul(randomInflation.numRecipients)
    )
  );
  const totalSupply = parseFloat(ethers.utils.formatUnits(ecoTotalSupply));
  const percent = numberFormatter((rewards / totalSupply) * 100);

  return (
    <Alert
      color="transparent"
      title={
        <Typography variant="body2">
          <b>Random inflation </b>
          <Typography variant="body2" color="active">
            <b>• {percent}%</b>
          </Typography>
        </Typography>
      }
    >
      <Typography variant="body2" color="secondary">
        User addresses are randomly selected to receive a share of new ECO
        supply.
      </Typography>
    </Alert>
  );
};
