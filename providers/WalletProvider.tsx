import React, { createContext, useContext, useEffect, useReducer } from "react";

import { BigNumber } from "ethers";

import { useAccount } from "wagmi";
import { useLazyQuery, useQuery } from "@apollo/client";

import { FundsLockup, WalletInterface } from "../types";
import { WALLET, WalletQueryResult } from "../queries";

import { toast } from "@ecoinc/ecomponents-old";
import {
  formatLockup,
  getLockupClaimAmount,
  isNullAddress,
} from "../utilities";
import { WeiPerEther, Zero } from "@ethersproject/constants";
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
  if (!data?.account?.fundsLockupDeposits.length)
    return [
      {
        id: "0x000asd",
        duration: 1000 * 24 * 3600 * 14,
        generation: 1010,
        address: "0x000asd",
        interest: 0.08,
        depositWindowEndsAt: new Date(Date.now() - 1000 * 24 * 3600 * 2),
        depositWindowDuration: 1000 * 24 * 3600 * 2,
        endsAt: new Date(Date.now() - 1000 * 24 * 3600 * 1),
        delegate: "0x000asd",
        amount: BigNumber.from(WeiPerEther.mul(10)),
        reward: BigNumber.from(WeiPerEther),
        withdrawnAt: null,
      },
    ];

  return data.account.fundsLockupDeposits.map(
    (lockupDeposit): FundsLockupWithDeposit => {
      const generation = parseInt(lockupDeposit.lockup.generation.number);
      return {
        ...formatLockup(generation, lockupDeposit.lockup),
        id: lockupDeposit.id,
        delegate: lockupDeposit.delegate,
        amount: BigNumber.from(lockupDeposit.amount),
        reward: BigNumber.from(lockupDeposit.reward),
        withdrawnAt:
          lockupDeposit.withdrawnAt && convertDate(lockupDeposit.withdrawnAt),
      };
    }
  );
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
  LockupDeposit,
  LockupWithdrawal,
  Convert,
}

type WalletAction =
  | {
      type: WalletActionType.Stake | WalletActionType.Unstake;
      amount: BigNumber;
    }
  | {
      type: WalletActionType.Convert;
      ecoXAmount: BigNumber;
      ecoAmount: BigNumber;
    }
  | {
      type: WalletActionType.SetState;
      state: WalletInterface;
    }
  | {
      type: WalletActionType.LockupDeposit;
      lockup: FundsLockup;
      address: string;
      amount: BigNumber;
      reward: BigNumber;
      inflationMultiplier: BigNumber;
    }
  | {
      type: WalletActionType.LockupWithdrawal;
      early: boolean;
      lockup: FundsLockupWithDeposit;
      inflationMultiplier: BigNumber;
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
    case WalletActionType.Convert:
      return {
        ...state,
        ecoXBalance: state.ecoXBalance.sub(action.ecoXAmount),
        ecoBalance: state.ecoBalance.add(action.ecoAmount),
      };
    case WalletActionType.LockupDeposit:
      let lockups;
      const depositLockups = state.lockups.filter(
        (lockup) => lockup.address === action.lockup.address
      );
      const currentDeposit = depositLockups.find(
        (lockup) => !lockup.withdrawnAt
      );

      if (currentDeposit) {
        // Depositing more tokens
        lockups = state.lockups.map((lockup): FundsLockupWithDeposit => {
          if (lockup.id !== currentDeposit.id) return lockup;
          return {
            ...currentDeposit,
            reward: currentDeposit.reward.add(action.reward),
            amount: currentDeposit.amount.add(
              action.amount.mul(action.inflationMultiplier)
            ),
          };
        });
      } else {
        // Log funds lockup deposit
        const id = `${action.lockup.address}-${action.address}-${depositLockups.length}.0`;
        const amount = action.amount.mul(action.inflationMultiplier);
        const lockupDeposit: FundsLockupWithDeposit = {
          ...action.lockup,
          id,
          amount,
          withdrawnAt: null,
          reward: action.reward,
          delegate: action.address,
        };

        lockups = [...state.lockups, lockupDeposit];
      }

      return { ...state, lockups };
    case WalletActionType.LockupWithdrawal:
      return {
        ...state,
        ecoBalance: state.ecoBalance.add(
          getLockupClaimAmount(
            action.lockup,
            action.inflationMultiplier,
            action.early
          )
        ),
        lockups: state.lockups.map((lockup) => {
          if (lockup.id !== action.lockup.id) return lockup;
          return { ...lockup, withdrawnAt: new Date() };
        }),
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
