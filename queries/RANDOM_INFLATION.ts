import { gql } from "@apollo/client";

type SubgraphInflationRootHashProposal = {
  address: string;
  acceptedRootHash: string | null;
  accepted: boolean;
};

type SubgraphRandomInflationClaim = {
  sequenceNumber: string;
  account: { address: string };
};

type SubgraphRandomInflation = {
  address: string;
  numRecipients: string;
  reward: string;
  claimPeriodStarts: string;
  CLAIM_PERIOD: string;
  seedCommit: string | null;
  seedReveal: string | null;
  claims: SubgraphRandomInflationClaim[];
  blockNumber: string;
  inflationRootHashProposal: SubgraphInflationRootHashProposal;
};

type SubgraphGeneration = {
  number: string;
  randomInflation: SubgraphRandomInflation | null;
};

export type RandomInflationQueryResult = {
  generations: SubgraphGeneration[];
};

export const RANDOM_INFLATION = gql`
  query RandomInflation {
    generations(orderBy: number, orderDirection: desc, skip: 1, first: 1) {
      number
      randomInflation {
        address: id
        numRecipients
        reward
        claimPeriodStarts
        CLAIM_PERIOD
        seedCommit
        seedReveal
        claims {
          sequenceNumber
          account {
            address: id
          }
        }
        blockNumber
        inflationRootHashProposal {
          address: id
          acceptedRootHash
          accepted
        }
      }
    }
  }
`;
