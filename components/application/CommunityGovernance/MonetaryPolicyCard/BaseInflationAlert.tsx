import React from "react";
import { Alert, Typography } from "@ecoinc/ecomponents";
import { useBaseInflation } from "../../../hooks/useBaseInflation";
import { useCommunity } from "../../../../providers";
import { css } from "@emotion/react";

export const { format } = new Intl.NumberFormat("en-EN", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
});

const fontWeight = css({ fontWeight: "bold" });

export const BaseInflationAlert = () => {
  const { currentGeneration } = useCommunity();
  const inflation = useBaseInflation(currentGeneration.blockNumber) * 100;
  return (
    <Alert
      color={inflation === 0 ? "secondary" : "transparent"}
      css={inflation === 0 ? { border: 0 } : ""}
      title={
        <Typography
          variant="body1"
          css={fontWeight}
          style={{ color: inflation === 0 ? "#5F869F" : "#128268" }}
        >
          Base inflation rate{" "}
          <Typography
            inline
            variant="body2"
            css={fontWeight}
            style={{
              color:
                inflation < 0
                  ? "#ED575F"
                  : inflation === 0
                  ? "#5F869F"
                  : "#128269",
            }}
          >
            • {format(inflation)}%
          </Typography>
        </Typography>
      }
    >
      <Typography variant="body2" color="secondary">
        Percent change in ECO supply from most recent monetary policy.
      </Typography>
    </Alert>
  );
};
