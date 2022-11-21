import { Column, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { BasicInfoCard } from "../BasicCard";
import { css } from "@emotion/react";
import { usePastProposals } from "../../../hooks/usePastProposals";
import PastProposalsCard from "./PastProposalsCard";
import InfiniteScroll from "react-infinite-scroll-component";
import LoaderAnimation from "../../Loader";

const underline = css({ textDecoration: "underline" });

interface PastProposalsProps {
  onCreateProposal(): void;
}

export const PastProposals: React.FC<PastProposalsProps> = ({
  onCreateProposal,
}) => {
  const { data: pastProposals, next, hasMore } = usePastProposals();

  if (!pastProposals.length)
    return (
      <BasicInfoCard
        title="There are no past proposals... yet"
        body={
          <React.Fragment>
            Be one of the first to{" "}
            <Typography
              link
              variant="body1"
              color="secondary"
              css={underline}
              href="#"
              onClick={(event) => {
                event.preventDefault();
                onCreateProposal();
              }}
            >
              submit a proposal
            </Typography>{" "}
            for consideration from the community!
          </React.Fragment>
        }
      />
    );

  return (
    <InfiniteScroll
      next={next}
      hasMore={hasMore}
      loader={<LoaderAnimation css={{ marginTop: 32 }} />}
      dataLength={pastProposals.length}
    >
      <Column gap="lg" items="center">
        {pastProposals.map((proposal) => {
          return <PastProposalsCard key={proposal.id} proposal={proposal} />;
        })}
      </Column>
    </InfiniteScroll>
  );
};
