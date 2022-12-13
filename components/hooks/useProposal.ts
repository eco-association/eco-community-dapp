import React, { useEffect, useReducer } from "react";
import { useQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import {
  CommunityProposal,
  PROPOSAL_QUERY,
  ProposalQueryResult,
  ProposalQueryVariables,
} from "../../queries/PROPOSAL_QUERY";
import { useAccount } from "wagmi";
import { convertDate } from "../../utilities/convertDate";
import { adjustVotingPower } from "../../utilities/adjustVotingPower";
import { getProposalResult } from "../../providers/CommunityProvider";
import { formatPolicyVotes } from "../../queries/fragments/PolicyVotesFragment";

export interface ProposalFull extends CommunityProposal {
  generation: CommunityProposal["generation"] & {
    createdAt: Date;
  };
}

function formatData(data?: ProposalQueryResult): ProposalFull {
  if (!data || !data.communityProposal) return null;

  const { support, policyVotes, ...communityProposal } = data.communityProposal;

  const supportedAt = support.length
    ? convertDate(support[0].createdAt)
    : undefined;

  const policyVote = policyVotes[0] && formatPolicyVotes(policyVotes[0]);
  if (policyVote) {
    policyVote.result = getProposalResult(policyVote);
  }

  return {
    ...communityProposal,
    policyVote,
    supported: !!supportedAt,
    supportedAt,
    totalStake: adjustVotingPower(data.communityProposal.totalStake),
    generation: {
      ...data.communityProposal.generation,
      number: parseInt(data.communityProposal.generation.number),
      createdAt: convertDate(data.communityProposal.generation.createdAt),
    },
    activities: data.communityProposal.activities.map((act) => ({
      ...act,
      timestamp: convertDate(act.timestamp),
    })),
  };
}

export enum ProposalReducerActionType {
  SetState,
  Support,
  Unsupport,
}

type ProposalAction =
  | {
      type: ProposalReducerActionType.SetState;
      state: ProposalFull;
    }
  | {
      type:
        | ProposalReducerActionType.Support
        | ProposalReducerActionType.Unsupport;
      votingPower: BigNumber;
    };

const proposalReducer: React.Reducer<ProposalFull, ProposalAction> = (
  state,
  action
) => {
  switch (action.type) {
    case ProposalReducerActionType.SetState:
      return action.state;
    case ProposalReducerActionType.Support:
    case ProposalReducerActionType.Unsupport:
      const supported = action.type === ProposalReducerActionType.Support;
      return {
        ...state,
        supported,
        totalStake: supported
          ? state.totalStake.add(action.votingPower)
          : state.supported
          ? state.totalStake.sub(action.votingPower)
          : state.totalStake,
      };
  }
};

export const useProposal = (id: string) => {
  const account = useAccount();
  const [state, dispatch] = useReducer(proposalReducer, null);

  const { data, startPolling, stopPolling, ...opts } = useQuery<
    ProposalQueryResult,
    ProposalQueryVariables
  >(PROPOSAL_QUERY, {
    variables: {
      id: id.toLowerCase(),
      supporter: account.address?.toLowerCase(),
    },
  });

  useEffect(() => {
    if (data && data.communityProposal) {
      dispatch({
        type: ProposalReducerActionType.SetState,
        state: formatData(data),
      });
    }
  }, [data]);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return {
    ...opts,
    dispatch,
    proposal: state || formatData(data),
  };
};
