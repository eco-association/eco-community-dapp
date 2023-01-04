import React, { useEffect } from "react";
import { Column, Grid, styled, Typography } from "@ecoinc/ecomponents";
import { Header } from "../components/application/Header/Header";
import { useRouter } from "next/router";
import { BackButton } from "../components/application/commons/BackButton";
import { ProposalActivityCard } from "../components/application/Proposals/ProposalActivityCard";
import { ContractCard } from "../components/application/Proposals/ContractCard";
import { VotingCard } from "../components/application/CommunityGovernance/VotingCard/VotingCard";
import { useCommunity } from "../providers";
import {
  ProposalReducerActionType,
  useProposal,
} from "../components/hooks/useProposal";
import SupportCard from "../components/application/CommunityGovernance/SupportCard/SupportCard";
import {
  isSubmittingInProgress,
  isVotingInProgress,
  Support,
} from "../providers/CommunityProvider";
import { useVotingPower } from "../components/hooks/useVotingPower";
import { Textfit } from "react-textfit";
import { WalletBlock } from "../components/application/commons/WalletBlock";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { truncateText } from "../utilities";

const Content = styled(Column)({
  maxWidth: 780,
  margin: "0 auto",
});

const ActionCardContainer = styled.div({ marginTop: -24 });

const TRUSTEE_TOPICS_URL = process.env.NEXT_PUBLIC_TRUSTEE_TOPICS_URL;

function isLinkFromDomain(from: string): boolean {
  try {
    const fromUrl = new URL(from);
    const hostUrl = new URL(TRUSTEE_TOPICS_URL);
    return fromUrl.host === hostUrl.host;
  } catch (e) {}
  return false;
}

const Title: React.FC<{ title?: string }> = ({ title }) => {
  if (title === undefined) return <Skeleton count={2} height={20} />;

  return (
    <Typography variant="h1" color="white">
      <Textfit mode="multi" min={15} max={32} style={{ height: 157 }}>
        {truncateText(title, 720)}
      </Textfit>
    </Typography>
  );
};

const Description: React.FC<{ description?: string; loading?: boolean }> = ({
  description,
  loading,
}) => {
  if (loading) return <Skeleton count={4} height={16} />;

  const _description =
    description?.length > 0
      ? description
      : "This proposal doesn't have a description.";
  return (
    <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
      {_description}
    </Typography>
  );
};

const Proposal: React.FC = () => {
  const router = useRouter();
  const proposalId = router.query["id"]?.toString() || "";

  const { loading, proposal, dispatch } = useProposal(proposalId);
  const { selectedProposal, currentGeneration, stage } = useCommunity();
  const { votingPower } = useVotingPower(currentGeneration.blockNumber);

  useEffect(() => {
    if (!loading && !proposal) {
      // Redirect to home if proposal does not exist
      router.replace("/");
    }
  }, [loading, proposal, router]);

  const showSupportCard =
    currentGeneration.number === proposal?.generation.number &&
    isSubmittingInProgress(stage.name);
  const showVotingCard =
    isVotingInProgress(stage.name) && proposal?.id === selectedProposal?.id;

  const onSupport = (support: Support) => {
    dispatch({
      type:
        support === Support.YES
          ? ProposalReducerActionType.Support
          : ProposalReducerActionType.Unsupport,
      votingPower,
    });
  };

  return (
    <Header
      current="proposals"
      height={315}
      styles={{
        pageStyle: { paddingBottom: 48, maxHeight: 315 },
        bodyStyle: {
          paddingTop: 0,
          overflow: showSupportCard || showVotingCard ? undefined : "hidden",
        },
      }}
      content={
        <SkeletonTheme
          baseColor="#f6f9fb07"
          highlightColor="#fefefe07"
          duration={2}
        >
          <Content gap="lg">
            <BackButton />
            <Grid columns="1fr auto" gap="64px">
              <Title title={proposal?.name} />
              <Column gap="sm" style={{ alignSelf: "center" }}>
                <Typography color="success" variant="body1">
                  Created by
                </Typography>
                <WalletBlock address={proposal?.proposer} />
              </Column>
            </Grid>
          </Content>
        </SkeletonTheme>
      }
    >
      <SkeletonTheme duration={2}>
        <Content>
          {showSupportCard ? (
            <ActionCardContainer>
              <SupportCard
                proposal={proposal}
                votingPower={votingPower}
                onSupport={onSupport}
              />
            </ActionCardContainer>
          ) : null}
          {showVotingCard ? (
            <ActionCardContainer>
              <VotingCard small />
            </ActionCardContainer>
          ) : null}
          <Grid columns="1fr 288px" gap="48px" style={{ height: "100%" }}>
            <Column gap="lg" style={{ overflowY: "auto", paddingTop: 32 }}>
              <Typography variant="h4">Description</Typography>
              <Description
                loading={loading}
                description={proposal?.description}
              />
              {isLinkFromDomain(proposal?.url) ? (
                <Typography
                  link
                  target="_blank"
                  href={proposal.url}
                  variant="body1"
                  color="active"
                >
                  Link to Forum post
                </Typography>
              ) : null}
            </Column>
            <Column gap="lg" style={{ paddingTop: 32 }}>
              <ProposalActivityCard proposal={proposal} />
              <ContractCard address={proposal?.address} />
            </Column>
          </Grid>
        </Content>
      </SkeletonTheme>
    </Header>
  );
};

export default Proposal;
