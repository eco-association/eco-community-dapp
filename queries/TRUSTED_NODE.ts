import { gql } from "@apollo/client";

export type TrustedNodeQueryResult = {
  trustedNodes: {
    hoard: string;
    yearStartGen: string;
    yearEnd: string;
    voteReward: string;
    unallocatedRewardsCount: string;
  };
  generations: [{ number: string }];
};

export const TRUSTED_NODE = gql`
  query TRUSTED_NODE {
    trustedNodes(id: 0) {
      hoard
      yearStartGen
      yearEnd
      voteReward
      unallocatedRewardsCount
    }
    generations(first: 1, orderBy: number, orderDirection: desc) {
      number
    }
  }
`;
