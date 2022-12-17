import { gql } from "@apollo/client";
import { SubgraphVoteResult } from "./CURRENT_GENERATION";

export enum ActivityNotificationType {
  PROPOSAL_SUBMITTED = "ProposalSubmitted",
  PROPOSAL_QUORUM = "ProposalQuorum",
  PROPOSAL_VOTING = "ProposalVoting",
  LOCKUP = "Lockup",
  RANDOM_INFLATION = "RandomInflation",
  PROPOSAL_RESULT = "ProposalResult",
  PROPOSAL_EXECUTED = "ProposalExecuted",
  GENERATION_INCREMENTED = "Generation",
}

export type Activity = {
  type: ActivityNotificationType;
  timestamp: Date;

  communityProposal?: {
    id: string;
    name: string;
    generationNumber: string;
    policyVotes: {
      result: SubgraphVoteResult;
    }[];
  };

  randomInflation?: {
    id: string;
  };
  fundsLockup?: {
    id: string;
  };

  generation?: {
    number: number;
  };
};

export interface ActivityQuery {
  type: ActivityNotificationType;
  timestamp: string;
  communityProposal: {
    id: string;
    name: string;
    generationNumber: string;
    policyVotes: {
      result: SubgraphVoteResult;
    }[];
  };
  randomInflation: {
    id: string;
  };
  fundsLockup: {
    id: string;
  };
  generation: {
    number: string;
  };
}

export type ActivityQueryResults = {
  activityRecords: ActivityQuery[];
};

export const ACTIVITY_QUERY = gql`
  query ACTIVITY_QUERY {
    activityRecords(
      first: 30
      where: { type_not_in: [ProposalSupported, ProposalUnsupported] }
      orderBy: timestamp
      orderDirection: desc
    ) {
      type
      timestamp
      communityProposal {
        id
        name
        generationNumber
        policyVotes {
          result
        }
      }
      randomInflation {
        id
      }
      fundsLockup {
        id
      }
      generation {
        number
      }
    }
  }
`;
