import React, { useContext, useEffect, useReducer } from "react";
import { TokenDelegate } from "../../../../../../providers/VotingPowerSourcesProvider";
import { useDelegates } from "../../../../../hooks/useDelegates";
import { useWallet } from "../../../../../../providers";
import { useAccount } from "wagmi";

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
  SetDelegatesToMe,
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
      state: Record<DelegableToken, Partial<TokenDelegation>>;
    }
  | {
      type: DelegateActionType.SetTokenData;
      token: DelegableToken;
      state: TokenDelegation;
    }
  | {
      type: DelegateActionType.SetDelegatesToMe;
      token: DelegableToken;
      delegates: TokenDelegate[];
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
      return {
        ...action.state,
        eco: action.state.eco && { ...state.eco, ...action.state.eco },
        secox: action.state.secox && { ...state.secox, ...action.state.secox },
      };
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
    case DelegateActionType.SetDelegatesToMe:
      return {
        ...state,
        [action.token]: {
          ...state[action.token],
          delegatesToMe: action.delegates,
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
  const wallet = useWallet();
  const account = useAccount();
  const { data, isFetched, isLoading, dataUpdatedAt, isFetching } =
    useDelegates();

  const [state, dispatch] = useReducer(delegateReducer, defaultValue);

  useEffect(() => {
    if (isFetched) {
      const { ECODelegator, sECOxDelegator, sEcoXEnabled, ecoEnabled } = data;
      dispatch({
        type: DelegateActionType.SetState,
        state: {
          eco: {
            enabled: ecoEnabled,
            delegate:
              ECODelegator?.toLowerCase() === account.address.toLowerCase()
                ? undefined
                : ECODelegator,
          },
          secox: {
            enabled: sEcoXEnabled,
            delegate:
              sECOxDelegator?.toLowerCase() === account.address.toLowerCase()
                ? undefined
                : sECOxDelegator,
          },
        },
      });
    }
  }, [account.address, data, isFetched]);

  useEffect(() => {
    dispatch({
      type: DelegateActionType.Batch,
      actions: [
        {
          type: DelegateActionType.SetDelegatesToMe,
          token: "eco",
          delegates: wallet.ecoDelegatedToMe,
        },
        {
          type: DelegateActionType.SetDelegatesToMe,
          token: "secox",
          delegates: wallet.sEcoXDelegatedToMe,
        },
      ],
    });
  }, [wallet.ecoDelegatedToMe, wallet.sEcoXDelegatedToMe]);

  return (
    <ManageDelegationContext.Provider value={{ state, dispatch }}>
      {children}
    </ManageDelegationContext.Provider>
  );
};

export const useDelegationState = () => useContext(ManageDelegationContext);
