import {
  DelegableToken,
  DelegateAction,
  DelegateActionType,
  DelegateValidation,
  TokenDelegation,
  useDelegationState,
} from "../provider/ManageDelegationProvider";
import { useECO } from "../../../../../hooks/contract/useECO";
import { useECOxStaking } from "../../../../../hooks/contract/useECOxStaking";
import { txError } from "../../../../../../utilities";
import { Zero } from "@ethersproject/constants";

const validateToken = (
  state: TokenDelegation,
  enabled: boolean
): DelegateValidation | undefined => {
  // Here we need to disallow switching if the wallet is unableToReceive
  if (enabled) {
    if (state.delegate) {
      return DelegateValidation.Confirm;
    }
  } else {
    const totalDelegatedToMe = state.delegatesToMe.reduce(
      (acc, delegate) => acc.add(delegate.amount),
      Zero
    );
    if (!totalDelegatedToMe.isZero()) {
      return DelegateValidation.Blocked;
    }
  }
};

export const useManageDelegation = () => {
  const eco = useECO();
  const sEcoX = useECOxStaking();
  const { dispatch, state } = useDelegationState();

  const manageDelegation = async (token: DelegableToken, enabled: boolean) => {
    const tokenState = state[token];
    const contract = token === "eco" ? eco : sEcoX;
    if (tokenState.enabled === enabled) return;

    if (enabled) {
      let undelegated = false;
      try {
        if (tokenState.delegate) {
          const undelegateTx = await contract.undelegate();
          await undelegateTx.wait();
          undelegated = true;
        }
        const enableTx = await contract.enableDelegationTo();
        await enableTx.wait();
      } catch (error) {
        if (undelegated) {
          dispatch({
            type: DelegateActionType.SetDelegate,
            token,
            delegate: undefined,
          });
        }
        throw error;
      }
    } else {
      const disableTx = await contract.reenableDelegating();
      await disableTx.wait();
    }
  };

  const manageOneToken = async (
    token: DelegableToken,
    enabled: boolean,
    runValidation = true
  ) => {
    const validation = validateToken(state[token], enabled);
    if (runValidation && validation) {
      dispatch({
        token,
        type: DelegateActionType.Validate,
        validate: validation,
      });
      return;
    }

    dispatch({
      type: DelegateActionType.SetLoading,
      token,
      loading: true,
    });
    try {
      await manageDelegation(token, enabled);
      dispatch({
        type: DelegateActionType.SetEnabled,
        token,
        enabled,
      });
    } catch (err) {
      dispatch({
        type: DelegateActionType.SetLoading,
        token,
        loading: false,
      });
      txError("There was an error enabling delegation", err);
    }
  };

  const manageBothTokens = async (enabled: boolean, runValidation = true) => {
    if (runValidation) {
      const actions: DelegateAction[] = [];
      const ecoValidation = validateToken(state.eco, enabled);
      const ecoXValidation = validateToken(state.secox, enabled);
      if (ecoValidation) {
        actions.push({
          token: "eco",
          type: DelegateActionType.Validate,
          validate: ecoValidation,
        });
      }
      if (ecoXValidation) {
        actions.push({
          token: "secox",
          type: DelegateActionType.Validate,
          validate: ecoXValidation,
        });
      }
      if (actions.length) {
        dispatch({
          type: DelegateActionType.Batch,
          actions,
        });
        return;
      }
    }

    dispatch({
      type: DelegateActionType.Batch,
      actions: [
        {
          type: DelegateActionType.SetLoading,
          token: "eco",
          loading: true,
        },
        {
          type: DelegateActionType.SetLoading,
          token: "secox",
          loading: true,
        },
      ],
    });
    const actions: DelegateAction[] = [];
    try {
      await manageDelegation("eco", enabled);
      actions.push({
        type: DelegateActionType.SetEnabled,
        token: "eco",
        enabled,
      });
      await manageDelegation("secox", enabled);
      actions.push({
        type: DelegateActionType.SetEnabled,
        token: "secox",
        enabled,
      });
    } catch (err) {
      actions.push(
        {
          type: DelegateActionType.SetLoading,
          token: "eco",
          loading: false,
        },
        {
          type: DelegateActionType.SetLoading,
          token: "secox",
          loading: false,
        }
      );
      txError("There was an error enabling delegation", err);
    }
    dispatch({
      type: DelegateActionType.Batch,
      actions,
    });
  };

  return {
    manageBothTokens,
    manageOneToken,
  };
};
