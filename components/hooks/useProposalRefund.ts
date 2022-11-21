import { useCallback, useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  REFUND_PROPOSALS,
  RefundProposal,
  RefundProposalsQueryResult,
  RefundProposalsVariables,
} from "../../queries/REFUND_PROPOSALS";
import { useAccount } from "wagmi";
import { useCommunity } from "../../providers";
import { isSubmittingInProgress } from "../../providers/CommunityProvider";
import { CommunityInterface } from "../../types";

function isRefundable(proposal: RefundProposal, community: CommunityInterface) {
  const { policyVotes, generation } = proposal;

  if (parseInt(generation.number) === community.currentGeneration.number) {
    if (isSubmittingInProgress(community.stage.name)) return false;
  }

  return !policyVotes.length;
}

export const useProposalRefund = () => {
  const account = useAccount();
  const community = useCommunity();
  const [proposals, setProposals] = useState<RefundProposal[]>([]);

  const [getRefundProposals, { data }] = useLazyQuery<
    RefundProposalsQueryResult,
    RefundProposalsVariables
  >(REFUND_PROPOSALS);

  const fetch = useCallback(() => {
    getRefundProposals({ variables: { address: account.address } });
  }, [account.address, getRefundProposals]);

  const remove = useCallback((proposal: RefundProposal) => {
    setProposals((current) => current.filter((p) => p !== proposal));
  }, []);

  const reset = useCallback(() => setProposals([]), []);

  useEffect(() => {
    if (data) {
      setProposals(
        data.communityProposals.filter((proposal) =>
          isRefundable(proposal, community)
        )
      );
    }
  }, [community, data]);

  useEffect(() => {
    if (account.address) fetch();
  }, [account.address, fetch]);

  return { proposals, reset, fetch, remove };
};
