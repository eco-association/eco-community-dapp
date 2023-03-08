import { gql } from "@apollo/client";

export interface TokenDelegateFragment {
  token: { id: "eco" | "sEcox" };
  amount: string;
  blockStarted: string;
  blockEnded: string;
}

export interface TokenDelegateeFragment extends TokenDelegateFragment {
  delegator: { id: string };
}

export interface TokenDelegatorFragment extends TokenDelegateFragment {
  delegatee: { id: string };
}

export type VotingPowerSourceQueryResult = {
  account: {
    historicalECOBalances: { value: string }[];
    historicalsECOxBalances: { value: string }[];
    ecoVotingPower: { value: string }[];
    sEcoXVotingPower: { value: string }[];
    lockupsDelegatedToMe: {
      amount: string;
      lockup: {
        id: string;
        duration: string;
        depositWindowEndsAt: string;
      };
    }[];

    currentDelegatees: TokenDelegateeFragment[];
    historicalDelegatees: TokenDelegateeFragment[];
    currentDelegations: TokenDelegatorFragment[];
    historicalDelegations: TokenDelegatorFragment[];
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
        where: { blockNumber_lte: $blocknumber }
      ) {
        value
      }
      historicalsECOxBalances(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { blockNumber_lte: $blocknumber }
      ) {
        value
      }
      ecoVotingPower: historicalVotingPowers(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { token: "eco", blockNumber_lte: $blocknumber }
      ) {
        value
      }
      sEcoXVotingPower: historicalVotingPowers(
        first: 1
        orderBy: blockNumber
        orderDirection: desc
        where: { token: "sEcox", blockNumber_lte: $blocknumber }
      ) {
        value
      }
      lockupsDelegatedToMe: fundsLockupDepositsDelegatedToMe(
        where: { withdrawnAt: null }
      ) {
        amount
        lockup {
          id
          duration
          depositWindowEndsAt
        }
      }
      historicalDelegatees: tokenDelegatees(
        where: { blockStarted_lte: $blocknumber, blockEnded_gt: $blocknumber }
      ) {
        ...TokenDelegateFragment
        delegator {
          id
        }
      }
      currentDelegatees: tokenDelegatees(
        where: {
          token: "eco"
          blockStarted_lte: $blocknumber
          blockEnded: null
        }
      ) {
        ...TokenDelegateFragment
        delegator {
          id
        }
      }
      historicalDelegations: tokenDelegators(
        where: { blockStarted_lte: $blocknumber, blockEnded_gt: $blocknumber }
      ) {
        ...TokenDelegateFragment
        delegatee {
          id
        }
      }
      currentDelegations: tokenDelegators(
        where: { blockStarted_lte: $blocknumber, blockEnded: null }
      ) {
        ...TokenDelegateFragment
        delegatee {
          id
        }
      }
    }
    inflationMultipliers(
      first: 1
      orderBy: blockNumber
      orderDirection: desc
      where: { blockNumber_lte: $blocknumber }
    ) {
      value
    }
  }

  fragment TokenDelegateFragment on TokenDelegate {
    token {
      id
    }
    amount
    blockStarted
    blockEnded
  }
`;
