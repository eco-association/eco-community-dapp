import React from "react";
import { LinearInflationNotification } from "./LinearInflationNotification";
import { RefundNotification } from "./RefundNotification";
import { CookiesProvider } from "react-cookie";
export const Notifications = () => {
  return (
    <React.Fragment>
      <CookiesProvider>
        <RefundNotification />
        <LinearInflationNotification />
      </CookiesProvider>
    </React.Fragment>
  );
};
