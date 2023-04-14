import React from "react";
import {
  DelegableToken,
  DelegateAction,
  DelegateActionType,
  DelegateValidation,
  TokenDelegation,
  useDelegationState,
} from "../provider/ManageDelegationProvider";
import { toast as nativeToast, ToastOptions } from "react-toastify";
import { useECO } from "../../../../../hooks/contract/useECO";
import { useECOxStaking } from "../../../../../hooks/contract/useECOxStaking";
import { displayAddress, txError } from "../../../../../../utilities";
import { Zero } from "@ethersproject/constants";

const toastOpts: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  theme: "colored",
  style: {
    backgroundColor: "#F7FEFC",
    border: "solid 1px #5AE4BF",
    color: "#22313A",
    top: "115px",
  },
};

const getToastText = (delegate: string) => {
  if (!delegate) {
    return `🚀 Successfully un-delegated`;
  } else {
    return `🚀 Successfully delegated to ${displayAddress(delegate)}`;
  }
};

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

  const delegateToken = async (token: DelegableToken, delegate: string) => {
    dispatch({
      type: DelegateActionType.SetLoadingDelegation,
      token,
      loading: true,
    });
    const actions: DelegateAction[] = [
      {
        type: DelegateActionType.SetLoadingDelegation,
        token,
        loading: false,
      },
    ];
    const contract = token === "eco" ? eco : sEcoX;
    try {
      const tx = await contract.delegate(delegate);
      await tx.wait();

      actions.push({
        type: DelegateActionType.SetDelegate,
        token,
        delegate,
      });

      nativeToast(getToastText(delegate), toastOpts);
    } catch (err) {
      txError("Failed to delegate", err);
    }
    dispatch({
      type: DelegateActionType.Batch,
      actions,
    });
  };

  const undelegateToken = async (
    token: DelegableToken,
    onRequestClose?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    dispatch({
      type: DelegateActionType.SetLoadingDelegation,
      token,
      loading: true,
    });
    const actions: DelegateAction[] = [
      {
        type: DelegateActionType.SetLoadingDelegation,
        token,
        loading: false,
      },
    ];
    const contract = token === "eco" ? eco : sEcoX;
    try {
      const undelegateTx = await contract.undelegate();
      await undelegateTx.wait();
      actions.push({
        type: DelegateActionType.SetDelegate,
        token,
        delegate: undefined,
      });
      onRequestClose && onRequestClose(false);
    } catch (err) {
      txError("Unable to undelegate", err);
    }
    dispatch({
      type: DelegateActionType.Batch,
      actions,
    });
  };

  const undelegateBothTokens = async (
    setStep: (number) => void,
    setStatus: React.Dispatch<React.SetStateAction<string>>,
    onRequestClose?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    dispatch({
      type: DelegateActionType.Batch,
      actions: [
        {
          type: DelegateActionType.SetLoadingDelegation,
          token: "eco",
          loading: true,
        },
        {
          type: DelegateActionType.SetLoadingDelegation,
          token: "secox",
          loading: true,
        },
      ],
    });
    const actions: DelegateAction[] = [
      {
        type: DelegateActionType.SetLoadingDelegation,
        token: "eco",
        loading: false,
      },
      {
        type: DelegateActionType.SetLoadingDelegation,
        token: "secox",
        loading: false,
      },
    ];
    try {
      setStep(1);
      setStatus("Undelegating Eco");
      const tx1 = await eco.undelegate();
      await tx1.wait();
      actions.push({
        type: DelegateActionType.SetDelegate,
        token: "eco",
        delegate: undefined,
      });

      setStep(2);
      setStatus("Undelegating staked EcoX");
      const tx2 = await sEcoX.undelegate();
      await tx2.wait();
      actions.push({
        type: DelegateActionType.SetDelegate,
        token: "secox",
        delegate: undefined,
      });

      onRequestClose && onRequestClose(false);
    } catch (err) {
      txError("Unable to undelegate", err);
    }
    dispatch({
      type: DelegateActionType.Batch,
      actions,
    });
  };

  const delegateBothTokens = async (
    address: string,
    setStep: (number) => void,
    setStatus: React.Dispatch<React.SetStateAction<string>>,
    onRequestClose?: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    dispatch({
      type: DelegateActionType.Batch,
      actions: [
        {
          type: DelegateActionType.SetLoadingDelegation,
          token: "eco",
          loading: true,
        },
        {
          type: DelegateActionType.SetLoadingDelegation,
          token: "secox",
          loading: true,
        },
      ],
    });
    const actions: DelegateAction[] = [
      {
        type: DelegateActionType.SetLoadingDelegation,
        token: "eco",
        loading: false,
      },
      {
        type: DelegateActionType.SetLoadingDelegation,
        token: "secox",
        loading: false,
      },
    ];
    try {
      // delegating ECO token...
      setStep(1);
      setStatus("Delegating ECO");
      const tx1 = await eco.delegate(address);
      await tx1.wait();
      actions.push({
        type: DelegateActionType.SetDelegate,
        token: "eco",
        delegate: address,
      });

      // delegating ECOx Staking token...
      setStep(2);
      setStatus("Delegating staked ECOx");
      const tx2 = await sEcoX.delegate(address);
      await tx2.wait();
      actions.push({
        type: DelegateActionType.SetDelegate,
        token: "secox",
        delegate: address,
      });

      onRequestClose && onRequestClose(false);
      nativeToast(getToastText(address), toastOpts);
    } catch (err) {
      txError("Failed to delegate", err);
    }
    dispatch({
      type: DelegateActionType.Batch,
      actions,
    });
  };

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

  const manageBothTokens = async (
    enabled: boolean,
    runValidation = true,
    setStep: React.Dispatch<React.SetStateAction<number>>,
    setStatus: React.Dispatch<React.SetStateAction<string>>,
    onRequestClose?: () => void
  ) => {
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
      setStep(1);
      setStatus(enabled ? "Enabling ECO Delegation" : "Disabling ECO");
      await manageDelegation("eco", enabled);
      actions.push({
        type: DelegateActionType.SetEnabled,
        token: "eco",
        enabled,
      });
      setStep(2);
      setStatus(
        enabled ? "Enabling staked ECOx Delegation" : "Disabling staked ECOx"
      );
      await manageDelegation("secox", enabled);
      actions.push({
        type: DelegateActionType.SetEnabled,
        token: "secox",
        enabled,
      });
      onRequestClose && onRequestClose();
      nativeToast(
        enabled
          ? "💪 Success! You are now a Delegate."
          : "Done. You’re no longer a delegate.",
        toastOpts
      );
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
    manageOneToken,
    manageBothTokens,
    delegateToken,
    delegateBothTokens,
    undelegateToken,
    undelegateBothTokens,
  };
};
