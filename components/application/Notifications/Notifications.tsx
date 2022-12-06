import React from "react";
import { RefundNotification } from "./RefundNotification";
import { RandomInflationNotification } from "./RandomInflationNotification";

export const Notifications = () => {
  return (
    <React.Fragment>
      <RefundNotification />
      <RandomInflationNotification />
    </React.Fragment>
  );
};
