import { Column, Typography } from "@ecoinc/ecomponents";
import { ProposalCard } from "../ProposalCard";
import React from "react";
import { GenerationStage, ProposalType, Stage } from "../../../../types";
import { BigNumber } from "ethers";
import { BasicInfoCard } from "../BasicCard";
import { css } from "@emotion/react";
import { SubmitProposalCard } from "./SubmitProposalCard";
import Link from "next/link";
import {
  isSubmittingInProgress,
  isVotingInProgress,
} from "../../../../providers/CommunityProvider";

interface ActiveProposalsProps {
  stage: Stage["name"];
  proposals: ProposalType[];
  totalVotingPower: BigNumber;
  votingProposal?: ProposalType;

  onCreateProposal(): void;
}

const underline = css({ textDecoration: "underline" });

export const ActiveProposals: React.FC<ActiveProposalsProps> = ({
  stage,
  proposals,
  totalVotingPower,
  onCreateProposal,
  votingProposal,
}) => {
  if (isSubmittingInProgress(stage) && stage !== GenerationStage.Quorum)
    return (
      <Column gap="lg" items="center">
        <SubmitProposalCard onCreateProposal={onCreateProposal} />
        {proposals.map((proposal) => {
          return (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              totalVotingPower={totalVotingPower}
            />
          );
        })}
      </Column>
    );

  if (stage === GenerationStage.Quorum) {
    return (
      <BasicInfoCard
        title="New proposals can be submitted for support starting next generation..."
        subtitle="A PROPOSAL HAS NOW ADVANCED TO A VOTE"
        body={
          <React.Fragment>
            In the meantime, you can browse proposals on the{" "}
            <a
              href="https://forums.localecos.com/login"
              target="_blank"
              style={{ textDecoration: "underline" }}
              rel="noreferrer"
            >
              Discourse forum
            </a>{" "}
            or work on your own.
          </React.Fragment>
        }
      />
    );
  }

  if (isVotingInProgress(stage)) {
    return (
      <BasicInfoCard
        title="Proposals can be submitted for support starting next generation..."
        body={
          <React.Fragment>
            In the meantime, you can{" "}
            <Link
              href={{
                pathname: "/proposal",
                query: { id: votingProposal?.id },
              }}
            >
              <Typography link variant="body1" color="success" css={underline}>
                vote on the current proposal
              </Typography>
            </Link>
            , you can work on creating a proposal and discussing proposals on
            the Discourse forum.
          </React.Fragment>
        }
      />
    );
  }

  return (
    <BasicInfoCard
      title="Proposals can be submitted for support starting next generation..."
      body={
        <React.Fragment>
          In the meantime, you can browse proposals on the{" "}
          <a
            href="https://forums.eco.org/c/egp/11"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Discourse forum
          </a>{" "}
          or work on your own.
        </React.Fragment>
      }
    />
  );
};
