import React, { useState } from "react";
import {
  Button,
  Column,
  Input,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import LoaderAnimation from "../../../Loader";
import { Option } from "./ManageDelegationModal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useDelegationState } from "./provider/ManageDelegationProvider";
import { GasFee } from "../../../commons/GasFee";
import chevronDown from "../../../../../public/images/chevron-down.svg";
import Image from "next/image";
import { useManageDelegation } from "./hooks/useManageDelegation";
import { Steps } from "./Steps";
import TextLoader from "../../../commons/TextLoader";

interface DelegateCardProps {
  onRequestClose?: () => void;
  fromAdvanced?: boolean;
  lockup?: string;
  delegate?: string;
  option: Option;
  setOpenAdvanced?: () => void;
}

const AdvancedSelectBox = styled(Row)({
  width: "max-content",
  justifyContent: "flex-end",
  backgroundColor: "#DEE6EB",
  borderRadius: "4px 0 0 0",
  marginRight: -16,
  marginBottom: -12,
  padding: "0 8px",
  cursor: "pointer",
});

const DelegateCard: React.FC<DelegateCardProps> = ({
  fromAdvanced,
  option,
  delegate,
  setOpenAdvanced,
  onRequestClose,
}) => {
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
  const [totalSteps, setTotalSteps] = useState(0);
  // An invalid address does not have delegation enabled
  const [invalidAddress, setInvalidAddress] = useState<string>();

  const [address, setAddress] = useState(delegate || "");

  const alreadyDelegating = !!(fromAdvanced
    ? option === Option.SEcoXMyWallet
      ? state.secox.delegate
      : state.eco.delegate
    : state.eco.delegate || state.secox.delegate);

  const submitHandler = async () => {
    if (fromAdvanced) {
      setTotalSteps(1);
      if (alreadyDelegating) {
        setStatus(
          "Undelegating " +
            (option === Option.SEcoXMyWallet ? "staked ecoX" : "eco")
        );
        const onComplete = () => {
          setAddress("");
          onRequestClose && onRequestClose();
        };
        await undelegateToken(
          option === Option.SEcoXMyWallet ? "secox" : "eco",
          onComplete
        );
        return;
      }
      await delegateToken(
        option === Option.SEcoXMyWallet ? "secox" : "eco",
        address,
        setInvalidAddress
      );
    } else {
      setTotalSteps(2);
      if (alreadyDelegating) {
        await undelegateBothTokens(setStep, setStatus, onRequestClose);
        return;
      }
      await delegateBothTokens(
        address,
        setInvalidAddress,
        setStep,
        setStatus,
        onRequestClose
      );
    }
  };

  const loading = state.eco.loadingDelegation || state.secox.loadingDelegation;

  const isButtonDisabled =
    loading ||
    (!alreadyDelegating &&
      (!address ||
        !ethers.utils.isAddress(address) ||
        address === invalidAddress ||
        address === account.address.toLowerCase() ||
        address === delegate?.toLowerCase()));

  return (
    <div>
      <Column gap="lg">
        <Input
          label=""
          value={address}
          disabled={loading || alreadyDelegating}
          name="ethAddress"
          color="secondary"
          placeholder="Eth Address"
          onChange={(e) => setAddress(e.currentTarget.value)}
        />
        <Column gap="md">
          <Row gap="lg" items="center">
            <Button
              variant="fill"
              onClick={submitHandler}
              disabled={isButtonDisabled}
              color={alreadyDelegating ? "secondary" : "success"}
              style={
                alreadyDelegating
                  ? { background: "#BDCBD3", minWidth: "initial" }
                  : { minWidth: "initial" }
              }
            >
              {loading ? (
                <LoaderAnimation />
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
      {!fromAdvanced && setOpenAdvanced ? (
        <Row justify="end">
          <AdvancedSelectBox items="center" gap="sm">
            <Typography
              color="secondary"
              variant="subtitle1"
              onClick={setOpenAdvanced}
            >
              EXPERT MODE
            </Typography>
            <Image src={chevronDown} alt="" height={14} width={7} />
          </AdvancedSelectBox>
        </Row>
      ) : null}
    </div>
  );
};

export default DelegateCard;
