import React, { useEffect, useState } from "react";
import {
  Button,
  Column,
  Input,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import LoaderAnimation from "../../../Loader";
import { ManageDelegationOption } from "./ManageDelegationModal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useDelegationState } from "./provider/ManageDelegationProvider";
import { GasFee } from "../../../commons/GasFee";
import { useManageDelegation } from "./hooks/useManageDelegation";
import { Steps } from "./Steps";
import TextLoader from "../../../commons/TextLoader";
import { useECO } from "../../../../hooks/contract/useECO";
import { useECOxStaking } from "../../../../hooks/contract/useECOxStaking";
import { txError } from "../../../../../utilities";
import { Collapse } from "react-collapse";

interface DelegateCardProps {
  delegate?: string;
  option?: ManageDelegationOption;
  onRequestClose?: () => void;
}

const StyledInput = styled(Input)(({ theme, error }) => ({
  ...(error ? { color: theme.palette.error.main } : {}),
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

  const alreadyDelegating = !!(option
    ? option === ManageDelegationOption.SEcoXMyWallet
      ? state.secox.delegate
      : state.eco.delegate
    : state.eco.delegate || state.secox.delegate);

  // An invalid address does not have delegation enabled
  const [delegateInfo, setDelegateInfo] = useState({
    loading: false,
    address: address,
    enabled: alreadyDelegating,
  });

  const submitHandler = async () => {
    if (option) {
      setTotalSteps(1);
      if (alreadyDelegating) {
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
      if (alreadyDelegating) {
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
    (!alreadyDelegating &&
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

  const hasEnabledDelegation =
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
            error={hasEnabledDelegation}
            disabled={loading || alreadyDelegating}
            color={hasEnabledDelegation ? "error" : "secondary"}
            onChange={(e) => setAddress(e.currentTarget.value)}
          />
          <Collapse isOpened={hasEnabledDelegation}>
            <Typography variant="body2" color="error">
              This wallet is not currently a delegate.
            </Typography>
          </Collapse>
        </Column>
        <Column gap="md">
          <Row gap="lg" items="center">
            <Button
              variant="fill"
              onClick={submitHandler}
              color={alreadyDelegating ? "secondary" : "success"}
              disabled={
                isButtonDisabled ||
                delegateInfo.loading ||
                !delegateInfo.enabled
              }
              style={
                alreadyDelegating
                  ? { background: "#BDCBD3", minWidth: "initial" }
                  : { minWidth: "initial" }
              }
            >
              {loading ? (
                <LoaderAnimation />
              ) : delegateInfo.loading ? (
                "Checking..."
              ) : alreadyDelegating ? (
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
