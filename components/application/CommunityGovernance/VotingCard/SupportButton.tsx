import { Button, Column, Typography } from "@ecoinc/ecomponents";
import { Link, toast } from "@ecoinc/ecomponents-old";
import React from "react";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import { etherscanURL, txError } from "../../../../utilities";
import { usePolicyProposals } from "../../../hooks/contract/usePolicyProposals";
import { useGasFee } from "../../../hooks/useGasFee";
import { toast as nativeToast, ToastOptions } from "react-toastify";
import { SupportModalAction } from "./SupportModal";
import { CommunityProposal } from "../../../../queries/PROPOSAL_QUERY";
import { ProposalType } from "../../../../types";
import Loader from "../../Loader";

interface SupportButtonProps {
  action: SupportModalAction;
  proposal: ProposalType | CommunityProposal;
  loading?: boolean;

  onLoading(loading: boolean): void;

  onComplete(): void;
}

const toastOpts = (
  borderColor: string,
  backgroundColor: string
): ToastOptions => ({
  style: {
    borderStyle: "solid",
    borderWidth: "1px",
    borderColor,
    backgroundColor,
    color: "#22313A",
    top: "150px",
  },
  position: "top-center",
  hideProgressBar: true,
  theme: "colored",
});

const SupportButton: React.FC<SupportButtonProps> = ({
  action,
  proposal,
  loading,
  onLoading,
  onComplete,
}) => {
  const gasFee = useGasFee(500_000);
  const policyProposals = usePolicyProposals();
  const { preventUnauthenticatedActions } = useConnectContext();

  const assignSupport = async () => {
    const toastId = nativeToast(
      "Adding your support to this proposal...",
      toastOpts("#5AE4BF", "#F7FEFC")
    );

    try {
      const tx = await policyProposals.support(proposal.address);
      const supported = await tx.wait();
      if (!supported.status) throw new Error("Support failed");
      onComplete();
    } catch (error) {
      txError("Failed to support proposal", error);
    }
    nativeToast.dismiss(toastId);
  };

  const revokeSupport = async () => {
    try {
      const tx = await policyProposals.unsupport(proposal.address);
      const revokeSupportReceipt = await tx.wait();

      if (!revokeSupportReceipt.status)
        throw new Error("Remove Support Failed");

      toast({
        title: "Proposal Support Removed",
        body: (
          <Link value="View on Etherscan" href={etherscanURL(tx.hash, "tx")} />
        ),
        intent: "success",
      });

      onComplete();
    } catch (error) {
      txError("Failed to Remove Support", error);
    }
  };

  const handleProposalClick = async () => {
    const connected = preventUnauthenticatedActions();
    if (connected) {
      onLoading(true);
      if (action === SupportModalAction.For) {
        await assignSupport();
      } else {
        await revokeSupport();
      }
      onLoading(false);
    }
  };

  return (
    <Column items="start" gap="md">
      <Button
        disabled={loading}
        color={action === SupportModalAction.For ? "success" : "error"}
        style={{
          color: action !== SupportModalAction.For ? "#510408" : undefined,
        }}
        onClick={handleProposalClick}
      >
        {loading ? (
          <Loader />
        ) : action === SupportModalAction.For ? (
          "Support"
        ) : (
          "Undo Support"
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

export default SupportButton;
