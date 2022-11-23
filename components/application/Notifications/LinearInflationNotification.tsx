import { TopBar } from "../commons/TopBar";
import React from "react";
import { Typography } from "@ecoinc/ecomponents";
import { useCookies } from "react-cookie";
import { useBaseInflation } from "../../hooks/useBaseInflation";
import { useCommunity } from "../../../providers";
import moment from "moment";

function formatDate(date?: Date) {
  return moment(date).format("DD/MM/YYYY @hh:mma");
}

export const LinearInflationNotification = () => {
  const { currentGeneration } = useCommunity();
  const inflation = useBaseInflation(currentGeneration.blockNumber);

  const [cookies, setCookie] = useCookies(["rebaseBannerDismiss"]);

  const handleDismiss = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setCookie("rebaseBannerDismiss", "true");
  };

  if (cookies.rebaseBannerDismiss === "true" || inflation === 0) return;

  return (
    <TopBar onRequestClose={handleDismiss}>
      <Typography variant="body2">
        Linear rebasing occurred at the start of this generation on{" "}
        {formatDate(currentGeneration.createdAt)}.{" "}
        <Typography variant="body2">
          <b>All ECO balances have been updated</b>
        </Typography>{" "}
        accordingly.
      </Typography>
    </TopBar>
  );
};
