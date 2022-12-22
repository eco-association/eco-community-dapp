import { gql } from "@apollo/client";

export type VotingPowerSourceQueryResult = {
  account: {
    historicalECOBalances: { value: string }[];
    historicalsECOxBalances: { value: string }[];
    ecoVotingPower: { value: string }[];
    sEcoXVotingPower: { value: string }[];
    sECOxDelegatedToMe: {
      id: string;
      sECOx: string;
    }[];
    ECODelegatedToMe: {
      id: string;
      ECO: string;
    }[];
    fundsLockupDepositsDelegatedToMe: {
      amount: string;
      lockup: {
        id: string;
        duration: string;
        depositWindowEndsAt: string;
      };
    }[];
  };
  inflationMultipliers: {
    value: string;
  }[];
};

export type VotingPowerSourceQueryVariables = {
  address: string;
  blocknumber: string | number;
};

export const VOTING_POWER_SOURCES = gql`
  query VOTING_POWER_SOURCES($address: String!, $blocknumber: BigInt!) {
    account(id: $address) {
      historicalECOBalances(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { blockNumber_lt: $blocknumber }
      ) {
        value
      }
      historicalsECOxBalances(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { blockNumber_lt: $blocknumber }
      ) {
        value
      }
      ecoVotingPower: historicalVotingPowers(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { token: "eco", blockNumber_lt: $blocknumber }
      ) {
        value
      }
      sEcoXVotingPower: historicalVotingPowers(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { token: "sEcox", blockNumber_lt: $blocknumber }
      ) {
        value
      }
      sECOxDelegatedToMe {
        id
        sECOx
      }
      ECODelegatedToMe {
        id
        ECO
      }
      fundsLockupDepositsDelegatedToMe {
        amount
        lockup {
          id
          duration
          depositWindowEndsAt
        }
      }
    }
    inflationMultipliers(
      first: 1
      orderBy: blockNumber
      orderDirection: desc
      where: { blockNumber_lt: $blocknumber }
    ) {
      value
    }
  }
`;
