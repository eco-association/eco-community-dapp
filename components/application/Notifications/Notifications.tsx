import React from "react";
import { CookiesProvider } from "react-cookie";

import { RefundNotification } from "./RefundNotification";
import { LinearInflationNotification } from "./LinearInflationNotification";
import { RandomInflationNotification } from "./RandomInflation/RandomInflationNotification";
import { useAccount } from "wagmi";

export const Notifications = () => {
  const account = useAccount();
  return (
    <CookiesProvider>
      <RefundNotification />
      <LinearInflationNotification />
      <RandomInflationNotification key={account.address} />
    </CookiesProvider>
  );
};
