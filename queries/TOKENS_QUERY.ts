import { gql } from "@apollo/client";

type SubgraphInflationMultiplier = {
  value: string;
  blockNumber: string;
};

export type TokensQueryResult = {
  inflationMultipliers: SubgraphInflationMultiplier[];
  eco: { totalSupply: string };
  ecox: { totalSupply: string };
  secox: { totalSupply: string };
  weco: { totalSupply: string };
};

export const TOKENS_QUERY = gql`
  query TOKENS {
    inflationMultipliers(orderBy: blockNumber, orderDirection: desc, first: 1) {
      value
      blockNumber
    }
    eco: token(id: "eco") {
      totalSupply
    }
    ecox: token(id: "ecox") {
      totalSupply
    }
    secox: token(id: "sEcox") {
      totalSupply
    }
    weco: token(id: "wEco") {
      totalSupply
    }
  }
`;
