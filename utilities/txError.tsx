import React, { ReactElement } from "react";
import { Link, toast } from "@ecoinc/ecomponents-old";

import etherscanURL from "./etherscanURL";
import { ethers } from "ethers";

type Error = {
  code?: number | ethers.errors;
  transactionHash?: string;
  message?: string;
  reason?: string;
};

const ETHERS_ERRORS: string[] = Object.values(ethers.errors);

const txError = (title: string, error: Error) => {
  let body: string | ReactElement;
  if (error.code === 4001 || error.code === ethers.errors.ACTION_REJECTED) {
    body = "User Denied Transaction";
  } else if (ETHERS_ERRORS.includes(error.code?.toString()) && error.reason) {
    body = error.reason;
  } else if (error.transactionHash) {
    body = (
      <Link
        value="View on Etherscan"
        href={etherscanURL(error.transactionHash, "tx")}
      />
    );
  } else if (error.message) {
    body = error.message;
  }

  toast({
    title,
    body,
    intent: "danger",
  });
};

export default txError;
