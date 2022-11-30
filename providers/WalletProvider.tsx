import React, { createContext, useContext, useEffect, useReducer } from "react";

import { BigNumber } from "ethers";

import { useAccount } from "wagmi";
import { useLazyQuery, useQuery } from "@apollo/client";

import { WalletInterface } from "../types";
import { WALLET, WalletQueryResult } from "../queries";

import { toast } from "@ecoinc/ecomponents-old";
import { formatLockup, isNullAddress } from "../utilities";
import { One, WeiPerEther, Zero } from "@ethersproject/constants";
import { TOKENS_QUERY, TokensQueryResult } from "../queries/TOKENS_QUERY";
import { FundsLockupWithDeposit } from "../types/FundsLockup";
import { convertDate } from "../utilities/convertDate";

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
  inflationMultiplier: WeiPerEther,
  ECODelegator: null,
  sECOxDelegator: null,
  lockups: [],
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

function getLockups(data?: WalletQueryResult): FundsLockupWithDeposit[] {
  if (!data?.account?.fundsLockupDeposits.length) return [];

  return data.account.fundsLockupDeposits.map((lockupDeposit) => {
    const generation = parseInt(lockupDeposit.lockup.generation.number);
    return {
      ...formatLockup(generation, lockupDeposit.lockup),
      id: lockupDeposit.id,
      delegate: lockupDeposit.delegate,
      amount: BigNumber.from(lockupDeposit.amount),
      reward: BigNumber.from(lockupDeposit.reward),
      lockupEndsAt: convertDate(lockupDeposit.lockupEndsAt),
      withdrawnAt:
        lockupDeposit.withdrawnAt && convertDate(lockupDeposit.withdrawnAt),
    };
  });
}

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
    inflationMultiplier: currentInflationMultiplier,
  };

  // wallet has current balances of eco, ecox, secox, and approved eco.
  // if wallet has not interacted with eco it will be null
  if (isNullAddress(address) || !data?.account)
    return {
      ...tokensData,
      ecoBalance: Zero,
      ecoXBalance: Zero,
      sEcoXBalance: Zero,
      wEcoBalance: Zero,
      inflationMultiplier: WeiPerEther,
      ECODelegator: null,
      sECOxDelegator: null,
      lockups: [],
    };

  const balances = data.account;

  return {
    ...tokensData,
    ecoBalance: BigNumber.from(balances.ECO).div(currentInflationMultiplier),
    ecoXBalance: BigNumber.from(balances.ECOx),
    sEcoXBalance: BigNumber.from(balances.sECOx),
    wEcoBalance: BigNumber.from(balances.wECO),
    ECODelegator: data.account.ECODelegator?.address || null,
    sECOxDelegator: data.account.sECOxDelegator?.address || null,
    lockups: getLockups(data),
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
