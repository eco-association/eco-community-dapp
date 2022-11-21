import { BigNumber } from "ethers";
import { Address } from ".";

type Approval = {
  owner: Address;
  spender: Address;
  value: BigNumber;
};

export type { Approval };
