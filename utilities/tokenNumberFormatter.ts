import { BigNumberish } from "ethers";
import { tokensToNumber } from "./tokensToNumber";

export const TokenNumberFormatter = new Intl.NumberFormat("en-EN", {});

export const tokenNumberFormatter = (amount: BigNumberish) =>
  TokenNumberFormatter.format(tokensToNumber(amount));
