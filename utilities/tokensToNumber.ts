import { BigNumberish, ethers } from "ethers";

export function tokensToNumber(amount?: BigNumberish) {
  if (!amount) return 0;
  return parseFloat(ethers.utils.formatEther(amount));
}
