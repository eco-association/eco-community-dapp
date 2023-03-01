import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Collapse } from "react-collapse";
import { Button, Column, Row, styled, Typography } from "@ecoinc/ecomponents";

import TextLoader from "../../../commons/TextLoader";
import InputAddress from "../../../commons/InputAddress";
import LoaderAnimation from "../../../Loader";

import { Steps } from "./Steps";
import { GasFee } from "../../../commons/GasFee";
import { useManageDelegation } from "./hooks/useManageDelegation";
import { ManageDelegationOption } from "./ManageDelegationModal";
import { displayAddress, txError } from "../../../../../utilities";

import { useECO } from "../../../../hooks/contract/useECO";
import { useECOxStaking } from "../../../../hooks/contract/useECOxStaking";
import { useDelegationState } from "./provider/ManageDelegationProvider";

interface DelegateCardProps {
  delegate: string;
  option?: ManageDelegationOption;
  onRequestClose?: () => void;
}

const StyledInput = styled(InputAddress)(({ theme, error }) => ({
  ...(error ? { color: theme.palette.error.main } : {}),
}));

const Note = styled(Column)(({ theme }) => ({
  padding: 8,
  backgroundColor: theme.palette.info.bg,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop height opacity",
}));

const DelegateCard: React.FC<DelegateCardProps> = ({
  option,
  delegate,
  onRequestClose,
}) => {
  const eco = useECO({ useProvider: true });
  const ecoXStaking = useECOxStaking({ useProvider: true });

  const account = useAccount();
  const { state } = useDelegationState();

  const {
    delegateToken,
    delegateBothTokens,
    undelegateToken,
    undelegateBothTokens,
  } = useManageDelegation();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");
  const [address, setAddress] = useState(delegate || "");
  const [totalSteps, setTotalSteps] = useState(0);

  const alreadyDelegating = !!delegate;

  const hasDelegateeChanged =
    alreadyDelegating &&
    (address || "").toLowerCase().trim() !== delegate.toLowerCase();

  const isUndelegating = alreadyDelegating && !hasDelegateeChanged;

  // An invalid address does not have delegation enabled
  const [delegateInfo, setDelegateInfo] = useState({
    loading: false,
    address: address,
    enabled: alreadyDelegating,
  });

  const submitHandler = async () => {
    if (option) {
      setTotalSteps(1);
      if (isUndelegating) {
        setStatus(
          "Undelegating " +
            (option === ManageDelegationOption.SEcoXMyWallet
              ? "staked ecoX"
              : "eco")
        );
        await undelegateToken(
          option === ManageDelegationOption.SEcoXMyWallet ? "secox" : "eco",
          () => {
            setAddress("");
            onRequestClose && onRequestClose();
          }
        );
        return;
      }
      await delegateToken(
        option === ManageDelegationOption.SEcoXMyWallet ? "secox" : "eco",
        address
      );
    } else {
      setTotalSteps(2);
      if (isUndelegating) {
        await undelegateBothTokens(setStep, setStatus, onRequestClose);
        return;
      }
      await delegateBothTokens(address, setStep, setStatus, onRequestClose);
    }
  };

  const loading = state.eco.loadingDelegation || state.secox.loadingDelegation;

  const _address = address.toLowerCase();
  const isButtonDisabled =
    loading ||
    (!isUndelegating &&
      (!address ||
        !ethers.utils.isAddress(_address) ||
        _address === delegate?.toLowerCase() ||
        _address.toLowerCase() === account.address.toLowerCase()));

  useEffect(() => {
    if (
      !isButtonDisabled &&
      delegateInfo.address.toLowerCase() !== _address.toLowerCase()
    ) {
      const checkDelegate = async (delegate: string) => {
        setDelegateInfo({
          loading: true,
          enabled: false,
          address: delegate,
        });
        try {
          let enabled;
          if (option) {
            const contract =
              option === ManageDelegationOption.SEcoXMyWallet
                ? ecoXStaking
                : eco;
            enabled = await contract.delegationToAddressEnabled(delegate);
          } else {
            const ecoEnabled = await eco.delegationToAddressEnabled(delegate);
            const sEcoXEnabled = await ecoXStaking.delegationToAddressEnabled(
              delegate
            );
            enabled = ecoEnabled && sEcoXEnabled;
          }
          setDelegateInfo((state) => {
            if (state.address !== delegate) return state;
            return {
              loading: false,
              enabled: enabled,
              address: delegate,
            };
          });
        } catch (err) {
          txError(
            "Failed to check delegate",
            new Error("We could not determine if the delegate is eligible")
          );
          setDelegateInfo({
            loading: false,
            enabled: false,
            address: delegate,
          });
        }
      };
      checkDelegate(_address);
    }
  }, [
    _address,
    delegateInfo.address,
    eco,
    ecoXStaking,
    isButtonDisabled,
    option,
  ]);

  const hasEnabledDelegationError =
    !isButtonDisabled &&
    _address === delegateInfo.address.toLowerCase() &&
    !delegateInfo.loading &&
    !delegateInfo.enabled;

  return (
    <div>
      <Column gap="lg">
        <Column gap="sm">
          <StyledInput
            label=""
            value={address}
            name="ethAddress"
            placeholder="Eth Address"
            disabled={loading}
            onChange={setAddress}
            error={hasEnabledDelegationError}
            color={hasEnabledDelegationError ? "error" : "secondary"}
          />
          <Collapse isOpened={hasEnabledDelegationError}>
            <Typography variant="body2" color="error">
              This wallet is not currently a delegate.
            </Typography>
          </Collapse>
          {hasDelegateeChanged &&
          !isButtonDisabled &&
          !delegateInfo.loading &&
          !hasEnabledDelegationError ? (
            <Collapse
              isOpened={
                hasDelegateeChanged &&
                !isButtonDisabled &&
                !delegateInfo.loading &&
                !hasEnabledDelegationError
              }
            >
              <Note gap="sm">
                <Typography variant="body3" color="info">
                  Note
                </Typography>
                <Typography variant="body2">
                  You are about to change your previous delegatee{" "}
                  <b>{displayAddress(delegate)}</b>.
                </Typography>
              </Note>
            </Collapse>
          ) : null}
        </Column>
        <Column gap="md">
          <Row gap="lg" items="center">
            <Button
              variant="fill"
              onClick={submitHandler}
              color={isUndelegating ? "secondary" : "success"}
              disabled={
                isButtonDisabled ||
                delegateInfo.loading ||
                !delegateInfo.enabled
              }
              style={
                isUndelegating
                  ? { background: "#BDCBD3", minWidth: "initial" }
                  : { minWidth: "initial" }
              }
            >
              {loading ? (
                <LoaderAnimation />
              ) : delegateInfo.loading ? (
                "Checking..."
              ) : isUndelegating ? (
                "Undelegate"
              ) : (
                "Confirm"
              )}
            </Button>
            {loading ? (
              totalSteps > 1 ? (
                <Steps
                  currentStep={step}
                  totalSteps={totalSteps}
                  status={status}
                />
              ) : (
                <TextLoader />
              )
            ) : null}
          </Row>
          <GasFee gasLimit={200_000} />
        </Column>
      </Column>
    </div>
  );
};

export default DelegateCard;
