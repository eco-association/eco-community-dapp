import { useLazyQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  PAST_PROPOSALS_QUERY,
  PastProposalsQuery,
  PastProposalsQueryResults,
  PastProposalsQueryVariables,
} from "../../queries/PAST_PROPOSALS_QUERY";
import { ActivityType } from "../../queries/PROPOSAL_QUERY";
import { CommunityInterface, ProposalType } from "../../types";
import { BigNumber } from "ethers";
import { useCommunity } from "../../providers";
import { SubgraphVoteResult } from "../../queries/CURRENT_GENERATION";
import {
  getProposalResult,
  isSubmittingInProgress,
  Vote,
} from "../../providers/CommunityProvider";
import { adjustVotingPower } from "../../utilities/adjustVotingPower";
import { convertDate } from "../../utilities/convertDate";

export type PastProposal = ProposalType & {
  voted?: Vote;
  createdAt: Date;
  result: SubgraphVoteResult;
  reachedVotingPhase: boolean;
};

function parsePastProposalQuery(
  community: CommunityInterface,
  proposals: PastProposalsQuery[]
) {
  return proposals.map((proposal: PastProposalsQuery): PastProposal => {
    const timestamp = proposal.activities.find(
      (a) => a.type === ActivityType.ProposalSubmitted
    )?.timestamp;

    const voted = proposal.policyVotes?.flatMap((proposal) => proposal.votes)[0]
      ?.yesAmount;

    const result = getProposalResult(community, proposal);

    const supportedAt = proposal.support.length
      ? convertDate(proposal.support[0].createdAt)
      : undefined;

    const reachedVotingPhase = !!proposal.policyVotes?.length;

    return {
      id: proposal.id,
      url: proposal.url,
      name: proposal.name,
      result,
      address: proposal.address,
      refunded: proposal.refunded,
      proposer: proposal.proposer,
      description: proposal.description,
      totalStake: adjustVotingPower(proposal.totalSupportAmount),
      reachedVotingPhase,
      reachedSupportThreshold: proposal.reachedSupportThreshold,
      createdAt: convertDate(timestamp),
      voted: voted && (BigNumber.from(voted).isZero() ? Vote.NO : Vote.YES),
      supported: !!proposal.support.length,
      supportedAt,
    };
  });
}

export const usePastProposals = () => {
  const account = useAccount();
  const community = useCommunity();

  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [proposals, setProposals] = useState<PastProposal[]>([]);

  const [getProposals, { data: queryData }] = useLazyQuery<
    PastProposalsQueryResults,
    PastProposalsQueryVariables
  >(PAST_PROPOSALS_QUERY);

  const baseVariables = useMemo((): PastProposalsQueryVariables => {
    let generation = community.currentGeneration.number;
    let excludeId;

    // Include current generation proposals if voting stage is reached
    if (!isSubmittingInProgress(community.stage.name)) {
      generation++;
      excludeId = community.selectedProposal?.id;
    }

    return {
      count: 20,
      excludeId,
      generation,
      account: account.address?.toString().toLowerCase(),
    };
  }, [
    account.address,
    community.currentGeneration.number,
    community.selectedProposal?.id,
    community.stage.name,
  ]);

  useEffect(() => {
    getProposals({ variables: baseVariables });
  }, [baseVariables, getProposals]);

  const next = async () => {
    const queryResult = await getProposals({
      variables: { ...baseVariables, skip },
    });
    const nextProposals = parsePastProposalQuery(
      community,
      queryResult.data.communityProposals
    );
    setProposals((p) => [...p, ...nextProposals]);
    setSkip((prevState) => prevState + nextProposals.length);
    setHasMore(nextProposals.length === baseVariables.count);
  };

  useEffect(() => {
    if (!proposals.length && queryData && queryData.communityProposals) {
      const proposals = parsePastProposalQuery(
        community,
        queryData.communityProposals
      );
      setProposals(proposals);
      setSkip(proposals.length);
      setHasMore(proposals.length === baseVariables.count);
    }
  }, [baseVariables.count, community, proposals, queryData]);

  return { data: proposals, next, hasMore };
};
