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
import {
  getProposalResult,
  useCommunity,
} from "../../providers/CommunityProvider";
import { CommunityInterface } from "../../types";

export interface ProposalFull extends CommunityProposal {
  generation: CommunityProposal["generation"] & {
    createdAt: Date;
  };
}

function formatData(
  community: CommunityInterface,
  data?: ProposalQueryResult
): ProposalFull {
  if (!data || !data.communityProposal) return null;

  const { support, policyVotes, ...communityProposal } = data.communityProposal;

  const supportedAt = support.length
    ? convertDate(support[0].createdAt)
    : undefined;

  let policyVote;
  if (policyVotes.length) {
    policyVote = {
      ...policyVotes[0],
      result: getProposalResult(community, data.communityProposal),
    };
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
  const community = useCommunity();
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
        state: formatData(community, data),
      });
    }
  }, [community, data]);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return {
    ...opts,
    dispatch,
    proposal: state || formatData(community, data),
  };
};
