import { gql } from "@apollo/client";

type SubgraphApproval = {
  value: string;
  spender: string;
};

type SubgraphDelegateAccount = {
  address: string;
  amount: string;
};

type SubgraphAccount = {
  address: string;
  ECO: string;
  ECOx: string;
  sECOx: string;
  wECO: string;
  ECODelegator: { address: string } | null;
  sECOxDelegator: { address: string } | null;
  ECODelegatedToMe: SubgraphDelegateAccount[];
  sECOxDelegatedToMe: SubgraphDelegateAccount[];
  approvedECO: SubgraphApproval[];
};

export type WalletQueryResult = {
  account: SubgraphAccount;
};

export const WALLET = gql`
  query wallet($account: ID!) {
    account(id: $account) {
      address: id
      ECO
      ECOx
      sECOx
      wECO
      ECODelegator {
        address: id
      }
      sECOxDelegator {
        address: id
      }
      ECODelegatedToMe {
        address: id
        amount: ECO
      }
      sECOxDelegatedToMe {
        address: id
        amount: sECOx
      }
      approvedECO {
        value
        spender
      }
    }
  }
`;
