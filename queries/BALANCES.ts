import { gql } from "@apollo/client";

export type SubgraphAccount = {
  ECO: string;
  ECOx: string;
  sECOx: string;
  wECO: string;
};

export type BalancesQueryResult = {
  account: SubgraphAccount;
  inflationMultipliers: { value: string }[];
};

export const BALANCES = gql`
  query BALANCES($account: ID!) {
    account(id: $account) {
      ECO
      ECOx
      sECOx
      wECO
    }
    inflationMultipliers(orderBy: blockNumber, orderDirection: desc, first: 1) {
      value
    }
  }
`;
