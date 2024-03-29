import { gql } from "@apollo/client";

type SubgraphBalance = {
  value: string;
  blockNumber: string;
};

type SubgraphAccount = {
  address: string;
  ECOVotingPowers: SubgraphBalance[];
};

export type EcoSnapshotQueryResult = {
  accounts: SubgraphAccount[];
  contractAddresses: {
    policy: string;
  };
};

export type EcoSnapshotQueryVariables = {
  blockNumber: number;
};

export const ECO_SNAPSHOT = gql`
  query EcoSnapshot($blockNumber: BigInt!) {
    accounts {
      address: id
      ECOVotingPowers: historicalVotingPowers(
        where: { token: "eco", blockNumber_lte: $blockNumber }
        orderBy: blockNumber
        orderDirection: desc
        first: 1
      ) {
        value
        blockNumber
      }
    }
    contractAddresses(id: "0") {
      policy
    }
  }
`;
