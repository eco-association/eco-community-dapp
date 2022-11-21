import { gql } from "@apollo/client";

export type VotingPowerSourceQueryResult = {
  account: {
    sECOx: string;
    ECO: string;
    sECOxDelegatedToMe: {
      id: string;
      sECOx: string;
    }[];
    ECODelegatedToMe: {
      id: string;
      ECO: string;
    }[];
    fundsLockupDepositsDelegatedToMe: {
      id: string;
      amount: string;
      lockupEndsAt: string;
    }[];
    fundsLockupDeposits: {
      id: string;
      amount: string;
      lockupEndsAt: string;
      delegate: {
        id: string;
      };
    }[];
  };
  inflationMultipliers: {
    value: string;
  }[];
};

export type VotingPowerSourceQueryVariables = {
  address: string;
};

export const VOTING_POWER_SOURCES = gql`
  query VotingPowerSources($address: String!) {
    account(id: $address) {
      ECO
      sECOx
      sECOxDelegatedToMe {
        id
        sECOx
      }
      ECODelegatedToMe {
        id
        ECO
      }
      fundsLockupDepositsDelegatedToMe {
        id
        amount
        lockupEndsAt
      }
      fundsLockupDeposits {
        id
        amount
        lockupEndsAt
        delegate {
          id
        }
      }
    }
    inflationMultipliers(first: 1, orderBy: blockNumber, orderDirection: desc) {
      value
    }
  }
`;
