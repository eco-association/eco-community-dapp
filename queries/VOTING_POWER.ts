import { gql } from "@apollo/client";

export type VotingPowerQueryResult = {
  ECOVotingPower: { value: string }[];
  sECOXVotingPower: { value: string }[];
};

export type VotingPowerQueryVariables = {
  address: string;
  blockNumber: string | number;
};

export const VOTING_POWER = gql`
  query VOTING_POWER($address: String!, $blockNumber: BigInt!) {
    ECOVotingPower: votingPowers(
      first: 1
      orderBy: blockNumber
      orderDirection: desc
      where: { account: $address, token: "eco", blockNumber_lt: $blockNumber }
    ) {
      value
    }
    sECOXVotingPower: votingPowers(
      first: 1
      orderBy: blockNumber
      orderDirection: desc
      where: { account: $address, token: "sEcox", blockNumber_lt: $blockNumber }
    ) {
      value
    }
  }
`;
