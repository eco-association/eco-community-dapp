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
};

export const VOTING_POWER_SOURCES = gql`
  query VOTING_POWER_SOURCES($address: String!) {
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
        amount
        lockup {
          id
          duration
          depositWindowEndsAt
        }
      }
    }
    inflationMultipliers(first: 1, orderBy: blockNumber, orderDirection: desc) {
      value
    }
  }
`;
