import { gql } from "@apollo/client";
import {
  LockupFragment,
  LockupFragmentResult,
} from "./fragments/LockupFragment";

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

  fundsLockupDeposits: {
    id: string;
    amount: string;
    reward: string;
    delegate: string;
    withdrawnAt: string | null;
    lockup: LockupFragmentResult & { generation: { number: string } };
  }[];
};

export type WalletQueryResult = {
  account: SubgraphAccount;
};

export const WALLET = gql`
  query WALLET($account: ID!) {
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
      fundsLockupDeposits {
        id
        amount
        reward
        delegate
        withdrawnAt
        lockup {
          ...LockupFragment
          generation {
            number
          }
        }
      }
    }
  }
  ${LockupFragment}
`;
