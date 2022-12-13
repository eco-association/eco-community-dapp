import React from "react";
import { ethers } from "ethers";
import { css } from "@emotion/react";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { useCommunity, useWallet } from "../../../../providers";
import { numberFormatter } from "../../../../utilities";

const fontWeight = css({ fontWeight: "bold" });

export const RandomInflationAlert = () => {
  const { randomInflation } = useCommunity();
  const { ecoTotalSupply } = useWallet();

  if (!randomInflation)
    return (
      <Alert
        css={{ border: 0 }}
        color="secondary"
        title={
          <Typography variant="body1" color="secondary" css={fontWeight}>
            Random Inflation • Inactive
          </Typography>
        }
      >
        <Typography variant="body2" color="secondary">
          User addresses are randomly selected to receive a share of new ECO
          supply.
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
        <Typography variant="body1" css={fontWeight}>
          Random inflation{" "}
          <Typography variant="body2" css={fontWeight} color="active">
            • {percent}%
          </Typography>
        </Typography>
      }
    >
      <Typography variant="body2" color="secondary">
        Random Inflation is active, ECO supply will increase by{" "}
        <Typography inline variant="body2" color="black" css={fontWeight}>
          {percent}%.
        </Typography>{" "}
        <Typography
          link
          href="https://docs.eco.org/core-concepts/monetary-governance/monetary-policy-levers#2-randomized-supply-inflation"
          variant="body2"
          target="_blank"
          color="secondary"
        >
          Learn more
        </Typography>
      </Typography>
    </Alert>
  );
};
