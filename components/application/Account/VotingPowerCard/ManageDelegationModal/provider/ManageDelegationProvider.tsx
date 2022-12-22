import React, { useContext, useEffect, useMemo, useReducer } from "react";
import { useAccount, useProvider } from "wagmi";
import { TokenDelegate } from "../../../../../../providers/UseVotingPowerSources";
import { ContractCallContext, Multicall } from "ethereum-multicall";
import {
  ECO__factory,
  ECOxStaking__factory,
} from "../../../../../../types/contracts";
import { useContractAddresses, useWallet } from "../../../../../../providers";

export enum DelegateValidation {
  Confirm = "Confirm",
  Blocked = "Blocked",
}

export interface TokenDelegation {
  enabled: boolean;
  validate?: DelegateValidation;
  delegate?: string;
  loading: boolean;
  loadingDelegation: boolean;
  delegatesToMe: TokenDelegate[];
}

export type DelegableToken = "eco" | "secox";

export type ManageDelegationState = Record<DelegableToken, TokenDelegation>;

const defaultValue: ManageDelegationState = {
  eco: {
    loading: false,
    loadingDelegation: false,
    enabled: false,
    delegate: undefined,
    delegatesToMe: [],
  },
  secox: {
    loading: false,
    loadingDelegation: false,
    enabled: false,
    delegate: undefined,
    delegatesToMe: [],
  },
};

const ManageDelegationContext = React.createContext<{
  state: ManageDelegationState;
  dispatch: React.Dispatch<DelegateAction>;
}>({
  state: defaultValue,
  dispatch: () => ({}),
});

export enum DelegateActionType {
  Batch,
  SetState,
  SetLoading,
  SetLoadingDelegation,
  SetEnabled,
  SetDelegate,
  SetTokenData,
  Validate,
  ResetValidations,
}

export type DelegateAction =
  | {
      type: DelegateActionType.ResetValidations;
    }
  | {
      type: DelegateActionType.SetState;
      state: ManageDelegationState;
    }
  | {
      type: DelegateActionType.SetTokenData;
      token: DelegableToken;
      state: TokenDelegation;
    }
  | {
      type: DelegateActionType.SetDelegate;
      token: DelegableToken;
      delegate: string;
    }
  | {
      type:
        | DelegateActionType.SetLoading
        | DelegateActionType.SetLoadingDelegation;
      token: DelegableToken;
      loading: boolean;
    }
  | {
      type: DelegateActionType.SetEnabled;
      token: DelegableToken;
      enabled: boolean;
    }
  | {
      type: DelegateActionType.Validate;
      token: DelegableToken;
      validate?: DelegateValidation;
    }
  | {
      type: DelegateActionType.Batch;
      actions: DelegateAction[];
    };

const delegateReducer: React.Reducer<ManageDelegationState, DelegateAction> = (
  state,
  action
) => {
  let newState: ManageDelegationState;
  switch (action.type) {
    case DelegateActionType.SetState:
      return action.state;
    case DelegateActionType.SetTokenData:
      return { ...state, [action.token]: action.state };
    case DelegateActionType.SetDelegate:
      return {
        ...state,
        [action.token]: {
          ...state[action.token],
          loading: false,
          delegate: action.delegate,
        },
      };
    case DelegateActionType.SetEnabled:
      return {
        ...state,
        [action.token]: {
          ...state[action.token],
          loading: false,
          validate: undefined,
          enabled: action.enabled,
          delegate: action.enabled ? undefined : state[action.token].delegate,
        },
      };
    case DelegateActionType.ResetValidations:
      return delegateReducer(state, {
        type: DelegateActionType.Batch,
        actions: Object.keys(state)
          .filter((key) => state[key].validate)
          .map(
            (token: DelegableToken): DelegateAction => ({
              type: DelegateActionType.SetTokenData,
              token,
              state: {
                ...state[token],
                validate: undefined,
              },
            })
          ),
      });
    case DelegateActionType.SetLoading:
    case DelegateActionType.SetLoadingDelegation:
      newState = delegateReducer(state, {
        type: DelegateActionType.ResetValidations,
      });
      return {
        ...newState,
        [action.token]: {
          ...newState[action.token],
          [action.type === DelegateActionType.SetLoading
            ? "loading"
            : "loadingDelegation"]: action.loading,
        },
      };
    case DelegateActionType.Validate:
      return {
        ...state,
        [action.token]: {
          ...state[action.token],
          validate: action.validate,
        },
      };
    case DelegateActionType.Batch:
      return action.actions.reduce(
        (newState, batchedAction) => delegateReducer(newState, batchedAction),
        state
      );
  }
};

export const ManageDelegationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const account = useAccount();
  const provider = useProvider();
  const wallet = useWallet();
  const { eco, sEcoX } = useContractAddresses();

  const [state, dispatch] = useReducer(delegateReducer, defaultValue);

  const multicall = useMemo(
    () => new Multicall({ ethersProvider: provider, tryAggregate: true }),
    [provider]
  );

  const multicallPaylood: ContractCallContext[] = useMemo(
    () => [
      {
        reference: "eco",
        contractAddress: eco,
        abi: [...ECO__factory.abi],
        calls: [
          {
            reference: "ecoEnabled",
            methodName: "delegationToAddressEnabled",
            methodParameters: [account.address],
          },
          {
            reference: "ECODelegator",
            methodName: "getPrimaryDelegate",
            methodParameters: [account.address],
          },
        ],
      },
      {
        reference: "secox",
        contractAddress: sEcoX,
        abi: [...ECOxStaking__factory.abi],
        calls: [
          {
            reference: "sEcoXEnabled",
            methodName: "delegationToAddressEnabled",
            methodParameters: [account.address],
          },
          {
            reference: "sECOxDelegator",
            methodName: "getPrimaryDelegate",
            methodParameters: [account.address],
          },
        ],
      },
    ],
    [account.address, eco, sEcoX]
  );

  useEffect(() => {
    if (!account.isConnected || state.secox.loading || state.eco.loading)
      return;

    (async () => {
      const { results } = await multicall.call(multicallPaylood);

      const [ecoEnabled, ECODelegator] = results.eco.callsReturnContext.flatMap(
        (r) => r.returnValues
      );
      const [sEcoXEnabled, sECOxDelegator] =
        results.secox.callsReturnContext.flatMap((r) => r.returnValues);

      dispatch({
        type: DelegateActionType.SetState,
        state: {
          eco: {
            loading: false,
            loadingDelegation: false,
            enabled: ecoEnabled,
            delegate:
              ECODelegator?.toLowerCase() === account.address.toLowerCase()
                ? undefined
                : ECODelegator,
            delegatesToMe: wallet.ecoDelegatedToMe,
          },
          secox: {
            loading: false,
            loadingDelegation: false,
            enabled: sEcoXEnabled,
            delegate:
              sECOxDelegator?.toLowerCase() === account.address.toLowerCase()
                ? undefined
                : sECOxDelegator,
            delegatesToMe: wallet.sEcoXDelegatedToMe,
          },
        },
      });
    })();
  }, [
    account.address,
    account.isConnected,
    multicall,
    multicallPaylood,
    wallet.ecoDelegatedToMe,
    wallet.sEcoXDelegatedToMe,
    state.eco.loading,
    state.secox.loading,
  ]);

  return (
    <ManageDelegationContext.Provider value={{ state, dispatch }}>
      {children}
    </ManageDelegationContext.Provider>
  );
};

export const useDelegationState = () => useContext(ManageDelegationContext);
