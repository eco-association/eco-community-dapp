import { TopBar } from "../../commons/TopBar";
import { formatNumber } from "@ecoinc/ecomponents";
import React from "react";
import { useRandomInflation } from "../../../../providers/RandomInflationProvider";
import { tokensToNumber } from "../../../../utilities";

export const RandomInflationNotification = () => {
  const { setModalOpen, pendingClaims, claimableAmount } = useRandomInflation();

  if (!pendingClaims.length) return null;

  return (
    <React.Fragment>
      <TopBar onClick={() => setModalOpen(true)}>
        <b>
          Congratulations! You’ve received{" "}
          {formatNumber(tokensToNumber(claimableAmount))} ECO
        </b>{" "}
        from random inflation. Claim it now
      </TopBar>
    </React.Fragment>
  );
};
