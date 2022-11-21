import { gql } from "@apollo/client";

type SubgraphTotalVotingPower = {
  totalVotingPower: string;
  blockNumber: string;
};

type SubgraphGeneration = {
  id: string;
  policyProposal: SubgraphTotalVotingPower;
  policyVote: SubgraphTotalVotingPower | null;
};

export type TotalVotingPowerQueryResult = {
  generations: SubgraphGeneration[];
};

export const TOTAL_VOTING_POWER = gql`
  query totalVotingPower {
    generations(orderBy: id, orderDirection: desc, first: 1) {
      id
      policyProposal {
        totalVotingPower
        blockNumber
      }
      policyVote {
        totalVotingPower
        blockNumber
      }
    }
  }
`;
