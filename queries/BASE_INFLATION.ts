import { gql } from "@apollo/client";

type InflationMultiplier = {
  value: string;
  block: null;
};

export type BaseInflationQueryResult = {
  current: InflationMultiplier[];
  previous: InflationMultiplier[];
};

export const BASE_INFLATION = gql`
  query BASE_INFLATION($block: BigInt!) {
    current: inflationMultipliers(
      first: 1
      orderBy: blockNumber
      orderDirection: desc
    ) {
      value
      blockNumber
    }
    previous: inflationMultipliers(
      where: { blockNumber_lt: $block }
      first: 1
      orderBy: blockNumber
      orderDirection: desc
    ) {
      value
      blockNumber
    }
  }
`;
