import React, { useRef } from "react";
import { Column, Row, Typography, styled } from "@ecoinc/ecomponents";
import { Header, HeaderProps } from "../components/application/Header/Header";
import { HeaderInfo } from "../components/application/Header/HeaderInfo";
import {
  HeaderTap,
  HeaderTaps,
} from "../components/application/Header/HeaderTaps";
import { ActiveProposals } from "../components/application/Proposals/ActiveProposals/ActiveProposals";
import { useCommunity } from "../providers";

import { PastProposals } from "../components/application/Proposals/PastProposals/PastProposals";
import CreateProposal from "../components/application/Proposals/CreateProposal/CreateProposal";
import {
  ProposalsTab,
  useProposalTabContext,
} from "../providers/ProposalTabProvider";

const headerStyles: HeaderProps["styles"] = {
  scrollHeader: { height: 48, padding: "0 64px" },
  pageStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    gap: "48px",
  },
};
const TabContainer = styled.div({
  width: "100%",
  maxWidth: "500px",
});

const Proposals: React.FC = () => {
  const { proposals, totalVotingPower, selectedProposal, stage } =
    useCommunity();
  const { active, setActive } = useProposalTabContext();

  const tabsContainerRef = useRef<HTMLDivElement>();

  const getTabContent = () => {
    if (active === ProposalsTab.Create) return <CreateProposal />;

    if (active === ProposalsTab.Past)
      return (
        <PastProposals
          onCreateProposal={() => setActive(ProposalsTab.Create)}
        />
      );

    return (
      <ActiveProposals
        stage={stage.name}
        proposals={proposals}
        votingProposal={selectedProposal}
        totalVotingPower={totalVotingPower}
        onCreateProposal={() => setActive(ProposalsTab.Create)}
      />
    );
  };

  const tabs = (
    <HeaderTaps
      active={active}
      onSelect={(selected) => setActive(selected as ProposalsTab)}
    >
      <HeaderTap
        name={ProposalsTab.Active}
        label="Active Proposals"
        count={proposals.length}
      />
      <HeaderTap name={ProposalsTab.Past} label="Past Submissions" />
      <HeaderTap name={ProposalsTab.Create} label="Create" />
    </HeaderTaps>
  );

  const scrollHeader = (
    <Row items="end" justify="center" style={{ width: "100%" }}>
      {tabs}
    </Row>
  );

  const breakpoint = tabsContainerRef.current?.offsetTop
    ? tabsContainerRef.current?.offsetTop - 9
    : undefined;
  return (
    <Header
      current="proposals"
      breakpoint={breakpoint}
      scrollHeader={scrollHeader}
      styles={headerStyles}
      height={250}
      content={
        <Column gap="xl" items="center" justify="end">
          <Column gap="lg" items="center">
            <Typography variant="h1" color="white">
              Proposals
            </Typography>
            <HeaderInfo subtitle />
          </Column>
          <TabContainer ref={tabsContainerRef}>{tabs}</TabContainer>
        </Column>
      }
    >
      {getTabContent()}
    </Header>
  );
};

export default Proposals;
