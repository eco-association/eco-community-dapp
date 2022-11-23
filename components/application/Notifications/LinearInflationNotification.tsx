import { TopBar } from "../commons/TopBar";
import React from "react";
import { Typography } from "@ecoinc/ecomponents";
import { useCookies } from "react-cookie";
import { useBaseInflation } from "../../hooks/useBaseInflation";
import { useCommunity } from "../../../providers";
import moment from "moment";

export const LinearInflationNotification = () => {
  const [cookies, setCookie] = useCookies(["rebaseBannerDismiss"]);
  const { currentGeneration } = useCommunity();
  const inflation = useBaseInflation(currentGeneration.blockNumber) * 100;

  function formatDate(date?: Date | string) {
    let m;
    if (typeof date === "string") m = moment(parseInt(date) * 1000);
    else m = moment(date);
    return m.format("DD/MM/YYYY @hh:mma");
  }
  console.log(formatDate(currentGeneration.createdAt));
  const handleDismiss = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    setCookie("rebaseBannerDismiss", true);
  };

  if (cookies.rebaseBannerDismiss === "true" || inflation !== 0) return;
  return (
    <React.Fragment>
      <TopBar gap="sm" onRequestClose={handleDismiss}>
        <Typography variant="body2">
          Linear rebasing occured at the start of this generation on{" "}
          {formatDate(currentGeneration.createdAt)}.{" "}
          <Typography css={{ fontSize: 13 }} variant="h5" inline>
            All ECO balances have been updated
          </Typography>{" "}
          accordingly.
        </Typography>
      </TopBar>
    </React.Fragment>
  );
};
