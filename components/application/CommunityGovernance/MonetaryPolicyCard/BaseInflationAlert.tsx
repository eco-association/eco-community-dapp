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
  const inflation = useBaseInflation(currentGeneration.blockNumber);
  return (
    <Alert
      color={!inflation ? "secondary" : "transparent"}
      css={!inflation ? { border: 0 } : ""}
      title={
        <Typography
          variant="body2"
          color={inflation === 0 ? "secondary" : "primary"}
        >
          <b>
            Base Inflation Rate{" "}
            {!inflation ? (
              "• Inactive"
            ) : (
              <Typography variant="body2" css={fontWeight} color="active">
                • {format(inflation * 100)}%
              </Typography>
            )}
          </b>
        </Typography>
      }
    >
      <Typography variant="body2" color="secondary">
        Percent change in ECO supply from most recent monetary policy.
      </Typography>
    </Alert>
  );
};
