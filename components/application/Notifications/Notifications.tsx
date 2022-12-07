import React from "react";
import { CookiesProvider } from "react-cookie";

import { RefundNotification } from "./RefundNotification";
import { LinearInflationNotification } from "./LinearInflationNotification";
import { RandomInflationNotification } from "./RandomInflation/RandomInflationNotification";

export const Notifications = () => {
  return (
    <CookiesProvider>
      <RefundNotification />
      <LinearInflationNotification />
      <RandomInflationNotification />
    </CookiesProvider>
  );
};
