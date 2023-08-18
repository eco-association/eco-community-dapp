import { Column, Grid, Typography, styled } from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import { Header, HeaderProps } from "../components/application/Header/Header";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import VotingPowerCard from "../components/application/Account/VotingPowerCard/VotingPowerCard";
import EcoXCard from "../components/application/Account/EcoXCard/EcoXCard";
import { EcoCard } from "../components/application/Account/EcoCard/EcoCard";
import AccountActivityCard from "../components/application/Account/AccountActivity/AccountActivityCard";
import { HeaderInfo } from "../components/application/Header/HeaderInfo";
import { MonoText } from "../components/application/commons/MonoText";
import { breakpoints, mq } from "../utilities";

const headerStyle: HeaderProps["styles"] = {
  scrollHeader: { padding: "8px 64px 0 64px" },
};

const StyledMonoText = styled(MonoText)({
  padding: "0 16px",
  textAlign: "center",
});

const StyledGrid = styled(Grid)({
  width: "100%",
  gridTemplateColumns: "1fr",

  [mq(breakpoints.lg)]: {
    gridTemplateColumns: "1fr 450px",
    width: 980,
    margin: "-48px auto 0 auto",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
});

const Account = () => {
  const router = useRouter();
  const account = useAccount();

  useEffect(() => {
    if (!account.isConnected) {
      router.replace("/");
    }
  }, [account.isConnected, router]);

  return (
    <Header
      current="account"
      breakpoint={16}
      styles={headerStyle}
      content={
        <Column gap="lg" items="center" style={{ marginTop: 80 }}>
          <Typography variant="h1" color="white" style={{ lineHeight: 1 }}>
            My Account
          </Typography>
          <Column items="center">
            <HeaderInfo />
            <StyledMonoText variant="subtitle1" color="success">
              See your account activity, and manage your balances and voting
              power.
            </StyledMonoText>
          </Column>
        </Column>
      }
    >
      <StyledGrid gap="24px">
        <Column gap="xl">
          <EcoCard />
          <EcoXCard />
          <VotingPowerCard />
        </Column>
        <AccountActivityCard />
      </StyledGrid>
    </Header>
  );
};

export default Account;
