import React from "react";
import { Column, Grid, Typography } from "@ecoinc/ecomponents";
import { InfoBlocks } from "../components/application/CommunityGovernance/InfoBlocks";
import { Header } from "../components/application/Header/Header";
import { MonetaryPolicyCard } from "../components/application/CommunityGovernance/MonetaryPolicyCard/MonetaryPolicyCard";
import { ActivityCard } from "../components/application/CommunityGovernance/ActivityCard/ActivityCard";
import { VotingCard } from "../components/application/CommunityGovernance/VotingCard/VotingCard";
import { HeaderInfo } from "../components/application/Header/HeaderInfo";
import { useCommunity } from "../providers";

const Home: React.FC = () => {
  const { stage, nextGenerationStartsAt } = useCommunity();

  const gridStyle = function () {
    if (window.innerWidth < 500) {
      return {
        width: "100%",
        justifyContent: "space-between",
        gridTemplateColumns: "auto",
      };
    } else {
      return;
    }
  };
  const colStyle = function () {
    if (window.innerWidth < 500) {
      return {
        marginTop: "0",
      };
    } else {
      return { maxWidth: 980, margin: "-48px auto 0 auto" };
    }
  };
  const bodyStyle = function () {
    if (window.innerWidth < 500) {
      return { bodyStyle: { padding: 0 } };
    } else {
      return;
    }
  };

  const landingStyle = function () {
    if (window.innerWidth < 500) {
      return {
        display: "flex",
        flexDirection: "row",
        padding: "0 24px 20px 24px",
      };
    } else {
      return;
    }
  };

  const headerStyle = function () {
    if (window.innerWidth < 500) {
      return {
        textAlign: "left",
        gap: "24px",
        alignItems: "start",
      };
    } else {
      return;
    }
  };

  const headerText = function () {
    if (window.innerWidth < 500) {
      return {
        fontSize: "24px",
      };
    } else {
      return;
    }
  };

  return (
    <Header
      current="home"
      breakpoint={16}
      content={
        <Column items="center" gap="xl" style={landingStyle()}>
          <Column
            items="center"
            gap="md"
            css={{ marginTop: 16 }}
            style={headerStyle()}
          >
            <Typography variant="h1" color="white" style={headerText()}>
              Eco Community Governance
            </Typography>
            <HeaderInfo
              home
              stage={stage.name}
              endsAt={stage.endsAt}
              nextGenStartsAt={nextGenerationStartsAt}
            />
          </Column>
          <InfoBlocks />
        </Column>
      }
      styles={bodyStyle()}
    >
      <Column items="center" gap="xl" style={colStyle()}>
        <VotingCard />
        <Grid
          columns="calc(50% - 12px) calc(50% - 12px)"
          gap="24px"
          style={gridStyle()}
        >
          <MonetaryPolicyCard />
          <ActivityCard />
        </Grid>
      </Column>
    </Header>
  );
};

export default Home;
