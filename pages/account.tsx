import { Column, Typography } from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import AccountInfoBar from "../components/application/Account/AccountInfoBar";
import StakingCard from "../components/application/Account/StakingCard";
import { Header } from "../components/application/Header/Header";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useWallet } from "../providers";

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
      {/*<Grid*/}
      {/*  columns="calc(50% - 12px) calc(50% - 12px)"*/}
      {/*  gap="24px"*/}
      {/*  style={{*/}
      {/*    maxWidth: 980,*/}
      {/*    margin: "-48px auto 0 auto",*/}
      {/*    alignItems: "flex-start",*/}
      {/*    justifyContent: "space-between",*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <ManageDelegationCard />*/}
      {/*  <StakingCard balances={wallet} />*/}
      {/*</Grid>*/}

      <div
        style={{
          maxWidth: 980,
          margin: "-48px auto 0 auto",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <StakingCard balances={wallet} />
      </div>
    </Header>
  );
};

export default Account;
