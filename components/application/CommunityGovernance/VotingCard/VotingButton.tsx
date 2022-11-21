import { Button, Column, Typography } from "@ecoinc/ecomponents";
import React, { useState } from "react";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import { txError } from "../../../../utilities";
import { useGasFee } from "../../../hooks/useGasFee";
import { toast as nativeToast, ToastOptions } from "react-toastify";
import { usePolicyVotes } from "../../../hooks/contract/usePolicyVotes";
import LoaderAnimation from "../../Loader";
import { VotingModalAction } from "./VotingModal";
import { Vote } from "../../../../providers/CommunityProvider";

interface VotingButtonProps {
  type: VotingModalAction;
  prevVote?: Vote;

  onComplete(vote: Vote): void;
}

const toastOpts: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  theme: "colored",
  style: {
    backgroundColor: "#F7FEFC",
    border: "solid 1px #5AE4BF",
    color: "#22313A",
    top: "115px",
  },
};

function getActionText(type: VotingModalAction, prevVote?: Vote): string {
  if (type === VotingModalAction.For) return "for";
  if (type === VotingModalAction.Change) {
    return prevVote === Vote.NO ? "yes" : "No";
  }
  return "against";
}

const VotingButton: React.FC<VotingButtonProps> = ({
  type,
  prevVote,
  onComplete,
}) => {
  const policyVotes = usePolicyVotes();
  const gasFee = useGasFee(500_000);
  const { preventUnauthenticatedActions } = useConnectContext();

  const [loading, setLoading] = useState(false);

  const voteFor = async () => {
    try {
      const tx = await policyVotes.vote(true);
      const supported = await tx.wait();

      if (!supported.status) throw new Error("Support failed");

      nativeToast(`🚀 Successfully voted for proposal`, toastOpts);
      onComplete(Vote.YES);
    } catch (error) {
      txError("Failed to Support Proposal", error);
    }
  };

  const voteAgainst = async () => {
    try {
      const tx = await policyVotes.vote(false);
      const revokeSupportReceipt = await tx.wait();

      if (!revokeSupportReceipt.status)
        throw new Error("Revoke Support Failed");

      nativeToast(`🚀 Successfully voted against proposal`, toastOpts);
      onComplete(Vote.NO);
    } catch (error) {
      txError("Failed to Revoke Support", error);
    }
  };

  const handleProposalClick = async () => {
    const connected = preventUnauthenticatedActions();
    if (connected) {
      setLoading(true);
      if (
        type === VotingModalAction.For ||
        (type === VotingModalAction.Change && prevVote === Vote.NO)
      ) {
        await voteFor();
      } else {
        await voteAgainst();
      }
      setLoading(false);
    }
  };

  return (
    <Column gap="md" items="start">
      <Button
        onClick={handleProposalClick}
        color={
          type === VotingModalAction.For
            ? "success"
            : type === VotingModalAction.Against
            ? "error"
            : "primary"
        }
      >
        {loading ? (
          <LoaderAnimation />
        ) : (
          `Vote ${getActionText(type, prevVote)}`
        )}
      </Button>
      <Typography variant="body3">
        Estimated Gas Fee:{" "}
        <Typography variant="body3" color="secondary">
          {gasFee} ETH
        </Typography>
      </Typography>
    </Column>
  );
};

export default VotingButton;
