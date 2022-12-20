import { Column, Grid, Typography } from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import AccountInfoBar from "../components/application/Account/AccountInfoBar";
import { Header } from "../components/application/Header/Header";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "../providers";
import ManageDelegationCard from "../components/application/ManageDelegation/ManageDelegationCard";
import { LockupCard } from "../components/application/Account/LockupCard/LockupCard";
import StakeOrConvertCard from "../components/application/StakeOrConvert/StakeOrConvertCard";

const headerStyle = { scrollHeader: { padding: "8px 64px 0 64px" } };

const Account = () => {
  const router = useRouter();
  const account = useAccount();
  const wallet = useWallet();

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
        <Column gap="lg" items="center" css={{ marginTop: 16 }}>
          <Typography variant="h1" color="white">
            My Account
          </Typography>
          <AccountInfoBar balances={wallet} />
        </Column>
      }
    >
      <Grid
        columns="calc(50% - 12px) calc(50% - 12px)"
        gap="24px"
        style={{
          maxWidth: 980,
          margin: "-48px auto 0 auto",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <ManageDelegationCard />
        <Column gap="xl">
          <StakeOrConvertCard />
          <LockupCard />
        </Column>
      </Grid>
    </Header>
  );
};

export default Account;
