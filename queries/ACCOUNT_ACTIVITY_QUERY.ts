import { gql } from "@apollo/client";
import {
  LockupFragment,
  LockupFragmentResult,
} from "./fragments/LockupFragment";
import { FundsLockupWithDeposit } from "../types/FundsLockup";
import { BigNumber } from "ethers";

export enum AccountActivityType {
  PROPOSAL_REFUNDED = "ProposalRefunded",
  PROPOSAL_SUBMITTED = "ProposalSubmitted",
  PROPOSAL_SUPPORTED = "ProposalSupported",
  PROPOSAL_UNSUPPORTED = "ProposalUnsupported",
  PROPOSAL_VOTED_FOR = "ProposalVoteFor",
  PROPOSAL_VOTED_AGAINST = "ProposalVoteAgainst",
  LOCKUP_DEPOSIT = "LockupDeposit",
  ECO_DELEGATE = "EcoDelegate",
  ECO_UNDELEGATE = "EcoUndelegate",
  SECOX_DELEGATE = "sEcoXDelegate",
  SECOX_UNDELEGATE = "sEcoXUndelegate",
  RANDOM_INFLATION_CLAIM = "RandomInflationClaim",
}

export type Activity = {
  id: string;
  type: AccountActivityType;
  amount: BigNumber;
  timestamp: Date;
  communityProposal?: {
    id: string;
    name: string;
    generationNumber: string;
    policyVotes: {
      result: boolean;
    };
  };
  randomInflationClaim?: {
    id: string;
  };
  lockupDeposit?: FundsLockupWithDeposit;
  generation?: {
    number: string;
  };
};

export type AccountActivity = {
  id: string;
  type: AccountActivityType;
  amount: string;
  timestamp: string;
  communityProposal: {
    id: string;
    name: string;
    generationNumber: string;
    policyVotes: {
      result: boolean;
    };
  };
  randomInflationClaim: {
    id: string;
  };
  lockupDeposit: {
    id: string;
    amount: string;
    reward: string;
    delegate: { id: string };
    withdrawnAt: string | null;
    lockup: LockupFragmentResult & { generation: { number: string } };
  };
  generation: {
    number: string;
  };
};

export type AccountActivityQueryResults = {
  activityRecords: AccountActivity[];
};

export const ACCOUNT_ACTIVITY_QUERY = gql`
  query ACCOUNT_ACTIVITY_QUERY($address: Bytes!) {
    activityRecords(
      first: 30
      where: {
        triggeredBy: $address
        type_in: [
          ProposalSubmitted
          ProposalSupported
          ProposalUnsupported
          ProposalRefunded
          ProposalVoteFor
          ProposalVoteAgainst
          RandomInflationClaim
          LockupDeposit
          EcoDelegate
          EcoUndelegate
          sEcoXDelegate
          sEcoXUndelegate
        ]
      }
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      type
      amount
      timestamp
      communityProposal {
        id
        name
        generationNumber
        policyVotes {
          result
        }
      }
      randomInflationClaim {
        id
      }
      lockupDeposit {
        id
        amount
        reward
        delegate {
          id
        }
        withdrawnAt
        lockup {
          ...LockupFragment
          generation {
            number
          }
        }
      }
      generation {
        number
      }
    }
  }
  ${LockupFragment}
`;
