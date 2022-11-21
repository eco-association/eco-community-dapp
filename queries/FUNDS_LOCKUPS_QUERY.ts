import { gql } from "@apollo/client";

type SubgraphFundsLockup = {
  address: string;
  generation: { id: string };
  depositWindowDuration: string;
  depositWindowEndsAt: string;
  duration: string;
  interest: string;
  totalLocked: string;
};

type SubgraphInflationMultiplier = {
  blockNumber: string;
  value: string;
};

export type FundsLockupQueryResult = {
  fundsLockups: SubgraphFundsLockup[];
  inflationMultipliers: SubgraphInflationMultiplier[];
};

export type FundsLockupQueryVariables = {
  timeNow: string;
};

export const FUNDS_LOCKUPS_QUERY = gql`
  query FUNDS_LOCKUPS_QUERY($timeNow: String!) {
    fundsLockups(
      where: { depositWindowEndsAt_lt: $timeNow }
      orderBy: depositWindowEndsAt
      orderDirection: asc
    ) {
      address: id
      generation {
        id
      }
      depositWindowDuration
      depositWindowEndsAt
      duration
      interest
      totalLocked
    }
    inflationMultipliers(orderBy: blockNumber, orderDirection: desc, first: 1) {
      blockNumber
      value
    }
  }
`;
