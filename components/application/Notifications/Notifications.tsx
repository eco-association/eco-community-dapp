import React from "react";
import { RefundNotification } from "./RefundNotification";
import { RandomInflationNotification } from "./RandomInflation/RandomInflationNotification";

export const Notifications = () => {
  return (
    <React.Fragment>
      <RefundNotification />
      <RandomInflationNotification />
    </React.Fragment>
  );
};
