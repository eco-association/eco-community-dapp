import React, { createContext, useContext, useEffect, useReducer } from "react";

import { BigNumber } from "ethers";

import { useAccount } from "wagmi";
import { useLazyQuery, useQuery } from "@apollo/client";

import { Address, Approval, WalletInterface } from "../types";
import { WALLET, WalletQueryResult } from "../queries";

import { toast } from "@ecoinc/ecomponents-old";
import { isNullAddress } from "../utilities";
import { WeiPerEther, Zero } from "@ethersproject/constants";
import { TOKENS_QUERY, TokensQueryResult } from "../queries/TOKENS_QUERY";

/**
 * Wallet provider
 *
 * gets wallet specific data from the subgraph when a user has one connected
 */
const DEFAULT_WALLET: WalletInterface = {
  ecoBalance: Zero,
  ecoXBalance: Zero,
  sEcoXBalance: Zero,
  wEcoBalance: Zero,
  ecoTotalSupply: Zero,
  ecoXTotalSupply: Zero,
  sEcoXTotalSupply: Zero,
  wEcoTotalSupply: Zero,
  ECODelegator: null,
  sECOxDelegator: null,
  ecoApprovals: [],
};

const DEFAULT_INFLATION = WeiPerEther;
const POLLING_TIME = 5_0000; // 5 seconds

type WalletContextState = WalletInterface & {
  dispatch: React.Dispatch<WalletAction>;
};

export const WalletContext = createContext<WalletContextState>({
  ...DEFAULT_WALLET,
  dispatch: () => ({}),
});

function getWalletBalances(
  address?: string,
  data?: WalletQueryResult,
  tokens?: TokensQueryResult
): WalletInterface {
  // current inflation value
  const currentInflationMultiplier = tokens?.inflationMultipliers.length
    ? BigNumber.from(tokens.inflationMultipliers[0].value)
    : DEFAULT_INFLATION;

  const tokensData = {
    ecoTotalSupply: BigNumber.from(tokens?.eco?.totalSupply || 0).div(
      currentInflationMultiplier
    ),
    ecoXTotalSupply: BigNumber.from(tokens?.ecox?.totalSupply || 0),
    sEcoXTotalSupply: BigNumber.from(tokens?.secox?.totalSupply || 0),
    wEcoTotalSupply: BigNumber.from(tokens?.weco?.totalSupply || 0),
  };

  // wallet has current balances of eco, ecox, secox, and approved eco.
  // if wallet has not interacted with eco it will be null
  if (isNullAddress(address) || !data?.account)
    return {
      ...tokensData,
      ecoBalance: BigNumber.from(0),
      ecoXBalance: BigNumber.from(0),
      sEcoXBalance: BigNumber.from(0),
      wEcoBalance: BigNumber.from(0),
      ECODelegator: null,
      sECOxDelegator: null,
      ecoApprovals: [],
    };

  const balances = data.account;
  const ecoApprovals = balances.approvedECO.map(
    (approval): Approval => ({
      owner: new Address(address),
      spender: new Address(approval.spender),
      value: BigNumber.from(approval.value),
    })
  );

  return {
    ...tokensData,
    ecoBalance: BigNumber.from(balances.ECO).div(currentInflationMultiplier),
    ecoXBalance: BigNumber.from(balances.ECOx),
    sEcoXBalance: BigNumber.from(balances.sECOx),
    wEcoBalance: BigNumber.from(balances.wECO),
    ECODelegator: data.account.ECODelegator?.address || null,
    sECOxDelegator: data.account.sECOxDelegator?.address || null,
    ecoApprovals,
  };
}

export enum WalletActionType {
  SetState,
  Stake,
  Unstake,
}

type WalletAction =
  | {
      type: WalletActionType.Stake | WalletActionType.Unstake;
      amount: BigNumber;
    }
  | {
      type: WalletActionType.SetState;
      state: WalletInterface;
    };

const delegateReducer: React.Reducer<WalletInterface, WalletAction> = (
  state,
  action
) => {
  switch (action.type) {
    case WalletActionType.SetState:
      return action.state;
    case WalletActionType.Stake:
    case WalletActionType.Unstake:
      return {
        ...state,
        sEcoXBalance:
          action.type === WalletActionType.Stake
            ? state.sEcoXBalance.add(action.amount)
            : state.sEcoXBalance.sub(action.amount),
        ecoXBalance:
          action.type === WalletActionType.Stake
            ? state.ecoXBalance.sub(action.amount)
            : state.ecoXBalance.add(action.amount),
      };
  }
};

export const WalletProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { address, isConnected } = useAccount();
  const tokensQueryOpts = useQuery<TokensQueryResult>(TOKENS_QUERY);
  const [getWallet, { data, error, startPolling, stopPolling }] =
    useLazyQuery<WalletQueryResult>(WALLET);

  const [state, dispatch] = useReducer(
    delegateReducer,
    getWalletBalances(address, data, tokensQueryOpts.data)
  );

  useEffect(() => {
    if (isNullAddress(address) || !isConnected) return;

    getWallet({ variables: { account: address.toLowerCase() } });

    startPolling(POLLING_TIME);
    return () => stopPolling();
  }, [address, getWallet, isConnected, startPolling, stopPolling]);

  useEffect(() => {
    dispatch({
      type: WalletActionType.SetState,
      state: getWalletBalances(address, data, tokensQueryOpts.data),
    });
  }, [address, data, tokensQueryOpts.data]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching wallet balances",
        intent: "danger",
      });
    }
  }, [error]);

  return (
    <WalletContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
