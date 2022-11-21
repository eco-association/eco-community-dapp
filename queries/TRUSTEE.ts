import { gql } from "@apollo/client";

export type TrusteeQueryResult = {
  trustee: {
    votingRecord: string;
    lastYearVotingRecord: string;
    fullyVestedRewards: string;
  } | null;
};

export const TRUSTEE = gql`
  query TRUSTEE($id: String!) {
    trustee(id: $id) {
      votingRecord
      lastYearVotingRecord
      fullyVestedRewards
    }
  }
`;
