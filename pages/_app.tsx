import "react-toastify/dist/ReactToastify.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@ecoinc/ecomponents-old/lib/styles.css";
import "rc-tooltip/assets/bootstrap.css";

import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import {
  CommunityProvider,
  ContractAddressProvider,
  VotingPowerProvider,
  WalletProvider,
} from "../providers";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { QueryClient, QueryClientProvider } from "react-query";
import Head from "next/head";
import { GoogleAnalytics } from "nextjs-google-analytics";

import { ThemeProvider } from "../components/contexts/ThemeProvider";
import { ConnectModalProvider } from "../providers/ConnectModalProvider";
import { ProposalTabProvider } from "../providers/ProposalTabProvider";
import { Notifications } from "../components/application/Notifications/Notifications";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/neat.css";
import "./index.css";

const PAGE_TITLE = process.env.NEXT_PUBLIC_DAPP_NAME;

const { chains, provider, webSocketProvider } = configureChains(
  [chain[process.env.NEXT_PUBLIC_CHAIN]],
  [
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_ID,
      stallTimeout: 1_000,
    }),
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY,
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "ECOx Community",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
  webSocketProvider,
});

const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_ECO_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

const App = ({ Component, pageProps }) => {
  const [unsecure, setUnsecure] = useState(true);

  useEffect(() => {
    setUnsecure(window.self !== window.top);
  }, []);

  if (unsecure) return null;

  return (
    <WagmiConfig client={wagmiClient}>
      <GoogleAnalytics gaMeasurementId="G-G60X13DNC2" />
      <Head>
        <title>{PAGE_TITLE}</title>
      </Head>
      <RainbowKitProvider chains={chains}>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={apolloClient}>
            <ContractAddressProvider>
              <VotingPowerProvider>
                <CommunityProvider>
                  <WalletProvider>
                    <ThemeProvider>
                      <ConnectModalProvider>
                        <ProposalTabProvider>
                          <Notifications />
                          <Component {...pageProps} />
                        </ProposalTabProvider>
                      </ConnectModalProvider>
                    </ThemeProvider>
                  </WalletProvider>
                  <ToastContainer position="bottom-right" />
                </CommunityProvider>
              </VotingPowerProvider>
            </ContractAddressProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
