import React, { useEffect } from "react";
import { Column, Grid, Row, styled, Typography } from "@ecoinc/ecomponents";
import { Header } from "../../components/application/Header/Header";
import { useRouter } from "next/router";
import { BackButton } from "../../components/application/commons/BackButton";
import { Blockie } from "../../components/application/commons/Blockie";
import { displayAddress } from "../../utilities";
import { ProposalActivityCard } from "../../components/application/Proposals/ProposalActivityCard";
import { ContractCard } from "../../components/application/Proposals/ContractCard";
import { useENS } from "../../components/hooks/useENS";
import { VotingCard } from "../../components/application/CommunityGovernance/VotingCard/VotingCard";
import { useCommunity } from "../../providers";
import {
  ProposalReducerActionType,
  useProposal,
} from "../../components/hooks/useProposal";
import SupportCard from "../../components/application/CommunityGovernance/SupportCard/SupportCard";
import {
  isSubmittingInProgress,
  isVotingInProgress,
  Support,
} from "../../providers/CommunityProvider";
import { useVotingPower } from "../../components/hooks/useVotingPower";
import { Textfit } from "react-textfit";

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

const Proposal: React.FC = () => {
  const router = useRouter();
  const proposalId = router.query["proposal-id"]?.toString() || "";

  const { loading, proposal, dispatch } = useProposal(proposalId);
  const { selectedProposal, currentGeneration, stage } = useCommunity();
  const { votingPower } = useVotingPower(currentGeneration.blockNumber);

  const ens = useENS(proposal?.proposer);

  useEffect(() => {
    if (!loading && !proposal) {
      // Redirect to home if proposal does not exist
      router.replace("/");
    }
  }, [loading, proposal, router]);

  if (!proposal) return null;

  const showSupportCard =
    currentGeneration.number === proposal.generation.number &&
    isSubmittingInProgress(stage.name);
  const showVotingCard =
    isVotingInProgress(stage.name) && proposal.id === selectedProposal?.id;

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
    <React.Fragment>
      <Header
        current="proposals"
        height={222}
        styles={{
          bodyStyle: {
            paddingTop: 0,
            overflow: showSupportCard || showVotingCard ? undefined : "hidden",
          },
          pageStyle: { paddingBottom: 48, maxHeight: 315 },
        }}
        content={
          <Content gap="lg">
            <BackButton />
            <Grid columns="1fr auto" gap="64px" alignItems="end">
              <Typography variant="h1" color="white">
                <Textfit
                  mode="multi"
                  min={15}
                  max={34}
                  forceSingleModeWidth={false}
                  style={{ maxHeight: 110, overflow: "hidden" }}
                >
                  {proposal.name}
                </Textfit>
              </Typography>
              <Column gap="sm">
                <Typography color="success" variant="body1">
                  Created by
                </Typography>
                <Row gap="md" items="center">
                  <Blockie address={proposal.proposer} />
                  <Column>
                    {ens ? (
                      <Typography variant="body2" color="white">
                        {ens}
                      </Typography>
                    ) : null}
                    <Typography variant="body3" color="success">
                      {displayAddress(proposal.proposer)}
                    </Typography>
                  </Column>
                </Row>
              </Column>
            </Grid>
          </Content>
        }
      >
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
              <Typography variant="body1" style={{ whiteSpace: "pre-wrap" }}>
                {proposal.description.length > 0
                  ? proposal.description
                  : "This proposal doesn't have a description."}
              </Typography>
              {isLinkFromDomain(proposal.url) ? (
                <Typography
                  link
                  target="_blank"
                  href={proposal.url}
                  variant="body1"
                  color="success"
                >
                  Link to Forum post
                </Typography>
              ) : null}
            </Column>
            <Column gap="lg" style={{ paddingTop: 32 }}>
              <ProposalActivityCard proposal={proposal} />
              <ContractCard address={proposal.address} />
            </Column>
          </Grid>
        </Content>
      </Header>
    </React.Fragment>
  );
};

export default Proposal;
