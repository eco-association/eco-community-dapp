import { gql } from "@apollo/client";

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
  id: string;
  activities: AccountActivity[];
}

export type AccountActivityQueryResults = {
  activityRecords: AccountActivity;
};

export const AccountActivityQuery = gql`
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
