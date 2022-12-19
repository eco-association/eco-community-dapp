import { useQuery } from "@apollo/client";
import { useContractAddresses } from "../../providers";
import {
  TRUSTED_NODE,
  TrustedNodeQueryResult,
} from "../../queries/TRUSTED_NODE";
import { Address } from "../../types";
import { BigNumber } from "ethers";

export interface TrustedNodesData {
  hoard: string;
  yearEnd: BigNumber;
  voteReward: BigNumber;
  yearStartGen: BigNumber;
  currentGeneration: BigNumber;
  unallocatedRewardsCount: BigNumber;
}

export const useTrustedNodes = () => {
  const { trustedNodes } = useContractAddresses();
  const { data: original, ...opts } = useQuery<TrustedNodeQueryResult>(
    TRUSTED_NODE,
    {
      fetchPolicy: "no-cache",
      variables: {
        account: trustedNodes.toString().toLowerCase(),
      },
    }
  );
  const data: TrustedNodesData = original
    ? {
        hoard: original.trustedNodes.hoard,
        yearEnd: BigNumber.from(original.trustedNodes.yearEnd),
        voteReward: BigNumber.from(original.trustedNodes.voteReward),
        yearStartGen: BigNumber.from(original.trustedNodes.yearStartGen),
        currentGeneration: BigNumber.from(original.generations[0].number),
        unallocatedRewardsCount: BigNumber.from(
          original.trustedNodes.unallocatedRewardsCount
        ),
      }
    : undefined;

  return { data, ...opts };
};
