import { BigNumber, BigNumberish } from "ethers";

export function adjustVotingPower(amount: BigNumberish) {
  return BigNumber.from(amount).div(10);
}
