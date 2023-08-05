import React from "react";
import { Column, Grid, styled } from "@ecoinc/ecomponents";
import { Header } from "../components/application/Header/Header";
import { MonetaryPolicyCard } from "../components/application/CommunityGovernance/MonetaryPolicyCard/MonetaryPolicyCard";
import { ActivityCard } from "../components/application/CommunityGovernance/ActivityCard/ActivityCard";
import { VotingCard } from "../components/application/CommunityGovernance/VotingCard/VotingCard";
import HeaderContent from "../components/application/Header/HeaderContent";
import { breakpoints, mq } from "../utilities";

const Container = styled(Column)({
  margin: "-48px auto 0 auto",
  [mq(breakpoints.md)]: {
    maxWidth: 980,
  },
});

const StyledGrid = styled(Grid)({
  width: "100%",
  gridTemplateColumns: "1fr",

  [mq(breakpoints.md)]: {
    gridTemplateColumns: "calc(50% - 12px) calc(50% - 12px)",
    justifyContent: "space-between",
  },
});

const Home: React.FC = () => {
  return (
    <Header current="home" breakpoint={16} content={<HeaderContent />}>
      <Container items="center" gap="xl">
        <VotingCard />
        <StyledGrid gap="24px">
          <MonetaryPolicyCard />
          <ActivityCard />
        </StyledGrid>
      </Container>
    </Header>
  );
};

export default Home;
