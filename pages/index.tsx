import React from "react";
import { Column, Grid, Typography } from "@ecoinc/ecomponents";
import { InfoBlocks } from "../components/application/CommunityGovernance/InfoBlocks";
import { Header } from "../components/application/Header/Header";
import { MonetaryPolicyCard } from "../components/application/CommunityGovernance/MonetaryPolicyCard/MonetaryPolicyCard";
import { ActivityCard } from "../components/application/CommunityGovernance/ActivityCard/ActivityCard";
import { VotingCard } from "../components/application/CommunityGovernance/VotingCard/VotingCard";
import { HeaderInfo } from "../components/application/Header/HeaderInfo";

const Home: React.FC = () => {
  return (
    <Header
      current="home"
      breakpoint={16}
      content={
        <Column items="center" gap="xl">
          <Column items="center" gap="md" css={{ marginTop: 16 }}>
            <Typography variant="h1" color="white">
              Eco Community Governance
            </Typography>
            <HeaderInfo home />
          </Column>
          <InfoBlocks />
        </Column>
      }
    >
      <Column
        items="center"
        gap="xl"
        style={{ maxWidth: 980, margin: "-48px auto 0 auto" }}
      >
        <VotingCard />
        <Grid
          columns="calc(50% - 12px) calc(50% - 12px)"
          gap="24px"
          style={{
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <MonetaryPolicyCard />
          <ActivityCard />
        </Grid>
      </Column>
    </Header>
  );
};

export default Home;
