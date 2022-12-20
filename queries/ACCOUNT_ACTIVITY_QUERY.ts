import { gql } from "@apollo/client";
import { timeStamp } from "console";
import Account from "../pages/account";

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
}

const activities = {
  account: {
    id: "0x0r5r",
    activities: [
      {
        type: AccountActivityType.PROPOSAL_SUBMITTED,
        timestamp: new Date(),
        communityProposal: {
          id: 1,
          name: "Test One",
          generationNumber: 333,
        },
      },
      {
        type: AccountActivityType.PROPOSAL_SUPPORTED,
        timeStamp: new Date(),
        communityProposal: {
          id: 1,
          name: "Test One",
          generationNumber: 333,
        },
      },
    ],
    randomInflation: [],
    lockupDeposit: [],
  },
};

export type AccountActivity = {
  type: AccountActivityType;
  timestamp: Date;
  communityProposal: {
    id: string;
    name: string;
    generationNumber: string;
  };
  randomInflation: {
    id: string;
  };
  lockupDeposit: {
    id: string;
    amount: string;
    withdrawnAt: string;
  };
};
export interface AccountActivityQuery {
  account: {
    id: string;
    activities: {
      type: AccountActivityType;
      timestamp: string;
      communityProposal: {
        id: string;
        name: string;
        generationNumber: string;
      };
      randomInflation: {
        id: string;
      };
      lockupDeposit: {
        id: string;
        amount: string;
        withdrawnAt: string;
      };
    }[];
  };
}

export type AccountActivityQueryResults = {
  activityRecords: AccountActivityQuery;
};

export const ACCOUNT_ACTIVITY_QUERY = gql`
  query AccountActivityQuery($address: String!) {
    account(id: $address) {
      id
      activities(first: 30, orderBy: timestamp, orderDirection: desc) {
        type
        timestamp
        communityProposal {
          id
          name
          generationNumber
        }
        randomInflation {
          id
        }
        lockupDeposit {
          id
          amount
          withdrawnAt
        }
      }
    }
  }
`;