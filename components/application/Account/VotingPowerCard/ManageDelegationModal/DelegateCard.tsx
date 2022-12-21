import React, { useState } from "react";
import {
  Button,
  Column,
  FormTextField,
  Row,
  styled,
  Typography,
  useTheme,
} from "@ecoinc/ecomponents";
import { toast as nativeToast, ToastOptions } from "react-toastify";
import { displayAddress, txError } from "../../../../../utilities";
import { useECO } from "../../../../hooks/contract/useECO";
import { useECOxStaking } from "../../../../hooks/contract/useECOxStaking";
import LoaderAnimation from "../../../Loader";
import { Option } from "./ManageDelegationModal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import {
  DelegateActionType,
  useDelegationState,
} from "./provider/ManageDelegationProvider";
import { GasFee } from "../../../commons/GasFee";
import { useForm } from "react-hook-form";
import TextLoader from "../../../commons/TextLoader";
import chevronDown from "../../../../../public/images/chevron-down.svg";
import Image from "next/image";
import { useManageDelegation } from "./hooks/useManageDelegation";
import { invalid } from "moment";

interface DelegateCardProps {
  onRequestClose?: () => void;
  fromAdvanced?: boolean;
  lockup?: string;
  delegate?: string;
  option: Option;
  setOpenAdvanced: () => void;
}

type FormValues = {
  ethAddress: string;
};

const AdvancedSelectBox = styled(Row)(() => ({
  width: "max-content",
  justifyContent: "flex-end",
  backgroundColor: "#DEE6EB",
  borderRadius: "4px 0 0 0",
  marginRight: -16,
  marginBottom: -12,
  padding: "0 8px",
  cursor: "pointer",
}));

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

const DelegateCard: React.FC<DelegateCardProps> = ({
  fromAdvanced,
  option,
  delegate,
  setOpenAdvanced,
  onRequestClose,
}) => {
  const eco = useECO();
  const ecoX = useECOxStaking();
  const account = useAccount();
  const { dispatch, state } = useDelegationState();
  const { simpleDelegation, simpleUndelegate } = useManageDelegation();

  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  // An invalid address does not have delegation enabled
  const [invalidAddress, setInvalidAddress] = useState<string>();
  const alreadyDelegating = state.eco.delegate || state.secox.delegate;

  const {
    control,
    getValues,
    handleSubmit,
    formState: { isValid },
  } = useForm<FormValues>({
    defaultValues: { ethAddress: delegate || "" },
    mode: "onChange",
  });

  const submitHandler = async (data: FormValues) => {
    const address = data.ethAddress.toLowerCase().trim();
    const contract = option === Option.SEcoXMyWallet ? ecoX : eco;

    if (alreadyDelegating) {
      return simpleUndelegate(setStep, onRequestClose, setLoading);
    }

    if (fromAdvanced) {
      try {
        setLoading(true);
        const enabled = await contract.delegationToAddressEnabled(address);
        if (enabled) {
          const tx = await contract.delegate(address);
          await tx.wait();

          dispatch({
            type: DelegateActionType.SetDelegate,
            token: option === Option.SEcoXMyWallet ? "secox" : "eco",
            delegate: address,
          });
          nativeToast(getToastText(address), toastOpts);
          setLoading(false);
        } else {
          setLoading(false);
          setInvalidAddress(address);
          txError(
            "Failed to delegate",
            new Error(
              `${displayAddress(address)} doesn't have enabled delegation`
            )
          );
        }
      } catch (err) {
        setLoading(false);
        txError("Failed to delegate", err);
      }
    } else {
      setLoading(true);
      await simpleDelegation(
        address,
        setInvalidAddress,
        setStep,
        onRequestClose,
        setLoading
      );
    }
    setLoading(false);
  };

  const ethAddress = getValues().ethAddress.toLowerCase().trim();
  const secondaryColor = theme.palette.secondary.main;

  const isButtonDisabled = () => {
    if (alreadyDelegating) return false;
    if (
      !ethAddress ||
      ethAddress === invalidAddress ||
      ethAddress === account.address.toLowerCase() ||
      ethAddress === delegate?.toLowerCase()
    )
      return true;
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Column gap="lg">
          <FormTextField
            label=""
            control={control}
            name="ethAddress"
            color="secondary"
            placeholder="Eth Address"
            style={{ color: secondaryColor }}
            rules={{ required: false, validate: ethers.utils.isAddress }}
          />
          <Column gap="md" items="start">
            <Row gap="lg">
              {alreadyDelegating && <Button color="success">Edit</Button>}
              <Button
                type="submit"
                color={!alreadyDelegating ? "success" : "secondary"}
                variant="fill"
                disabled={isButtonDisabled()}
              >
                {loading ? (
                  <LoaderAnimation />
                ) : !alreadyDelegating ? (
                  "Confirm"
                ) : (
                  "Undelegate"
                )}
              </Button>
              {loading && <TextLoader />}
            </Row>

            <GasFee gasLimit={500_000} />
          </Column>
        </Column>
      </form>
      {!fromAdvanced && (
        <Row style={{ width: "100%", justifyContent: "flex-end" }}>
          <AdvancedSelectBox>
            <Typography
              onClick={setOpenAdvanced}
              variant="subtitle1"
              color="secondary"
            >
              EXPERT MODE{" "}
              <Image src={chevronDown} alt="" height={10} width={5} />
            </Typography>
          </AdvancedSelectBox>
        </Row>
      )}
    </div>
  );
};

export default DelegateCard;
