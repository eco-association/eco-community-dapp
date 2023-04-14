import { gql } from "@apollo/client";
import {
  RandomInflationFragment,
  RandomInflationFragmentResult,
} from "./fragments/RandomInflationFragment";

type SubgraphInflationRootHashProposal = {
  address: string;
  accepted: boolean;
  acceptedRootHash: string | null;
};

type SubgraphRandomInflationClaim = {
  sequenceNumber: string;
  account: { address: string };
};

export type SubgraphRandomInflation = RandomInflationFragmentResult & {
  claims: SubgraphRandomInflationClaim[];
  inflationRootHashProposal: SubgraphInflationRootHashProposal;
};

export type RandomInflationQueryResult = {
  randomInflations: SubgraphRandomInflation[];
};

export const RANDOM_INFLATION = gql`
  query RANDOM_INFLATION {
    randomInflations(first: 10) {
      ...RandomInflationFragment
      claims {
        sequenceNumber
        account {
          address: id
        }
      }
      inflationRootHashProposal {
        address: id
        acceptedRootHash
        accepted
      }
    }
  }
  ${RandomInflationFragment}
`;
