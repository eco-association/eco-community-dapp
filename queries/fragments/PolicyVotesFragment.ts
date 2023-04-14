import { gql } from "@apollo/client";
import { SubgraphVoteResult } from "../CURRENT_GENERATION";
import { BasicPolicyVote } from "../../types/CommunityInterface";
import { adjustVotingPower } from "../../utilities/adjustVotingPower";
import { convertDate } from "../../utilities/convertDate";

export function formatPolicyVotes(
  fragmentResult?: PolicyVotesFragmentResult
): BasicPolicyVote {
  if (!fragmentResult) return;
  return {
    result: fragmentResult.result,
    policyId: fragmentResult.id,
    voteEnds: convertDate(fragmentResult.voteEnds),
    yesStake: adjustVotingPower(fragmentResult.yesVoteAmount),
    requiredStake: adjustVotingPower(fragmentResult.totalVoteAmount),
    majorityReachedAt: convertDate(fragmentResult.majorityReachedAt),
  };
}

export type PolicyVotesFragmentResult = {
  id: string;
  result: null | SubgraphVoteResult;
  voteEnds: string;
  yesVoteAmount: string;
  totalVoteAmount: string;
  majorityReachedAt: string;
};

export const PolicyVotesFragment = gql`
  fragment PolicyVotesFragment on PolicyVote {
    id
    result
    voteEnds
    yesVoteAmount
    totalVoteAmount
    majorityReachedAt
  }
`;
