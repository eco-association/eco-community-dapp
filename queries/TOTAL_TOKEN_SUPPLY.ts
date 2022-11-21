import { gql } from "@apollo/client";
export type Token = {
  name: string;
  symbol: string;
  totalSupply: string;
};

export type TotalTokenSupplyQueryResults = {
  tokens: Token[];
};
export const TOTAL_TOKEN_SUPPLY = gql`
  query MyQuery {
    tokens {
      name
      totalSupply
      symbol
    }
  }
`;
