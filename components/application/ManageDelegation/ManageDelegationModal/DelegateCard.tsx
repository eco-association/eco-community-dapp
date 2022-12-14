import {
  Button,
  Column,
  FormTextField,
  Typography,
  useTheme,
} from "@ecoinc/ecomponents";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast as nativeToast, ToastOptions } from "react-toastify";
import { displayAddress, txError } from "../../../../utilities";
import { useECO } from "../../../hooks/contract/useECO";
import { useECOxStaking } from "../../../hooks/contract/useECOxStaking";
import { useGasFee } from "../../../hooks/useGasFee";
import LoaderAnimation from "../../Loader";
import { Option } from "./ManageDelegationModal";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import {
  DelegateActionType,
  useDelegationState,
} from "./provider/ManageDelegationProvider";

interface DelegateCardProps {
  lockup?: string;
  delegate?: string;
  option: Option;
}

type FormValues = {
  ethAddress: string;
};

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

const DelegateCard: React.FC<DelegateCardProps> = ({ option, delegate }) => {
  const eco = useECO();
  const ecoX = useECOxStaking();
  const account = useAccount();
  const { dispatch } = useDelegationState();

  const theme = useTheme();
  const gasFee = useGasFee(500_000);

  const [loading, setLoading] = useState(false);

  // An invalid address does not have delegation enabled
  const [invalidAddress, setInvalidAddress] = useState<string>();

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

    setLoading(true);
    try {
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
      } else {
        setInvalidAddress(address);
        txError(
          "Failed to delegate",
          new Error(
            `${displayAddress(address)} doesn't have enabled delegation`
          )
        );
      }
    } catch (err) {
      txError("Failed to delegate", err);
    }
    setLoading(false);
  };

  const ethAddress = getValues().ethAddress.toLowerCase().trim();
  const secondaryColor = theme.palette.secondary.main;

  return (
    <div>
      <Typography variant="body1">Delegate votes </Typography>{" "}
      <Link href="#">
        <Typography link variant="body1" color="secondary">
          Browse Available
        </Typography>
      </Link>
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
            <Button
              type="submit"
              color="success"
              variant="fill"
              disabled={
                !isValid ||
                ethAddress === invalidAddress ||
                ethAddress === account.address.toLowerCase() ||
                ethAddress === delegate?.toLowerCase()
              }
            >
              {loading ? <LoaderAnimation /> : "Delegate"}
            </Button>
            <Typography variant="body3">
              Estimated Gas:{" "}
              <Typography variant="body3" color="secondary">
                {gasFee} ETH
              </Typography>
            </Typography>
          </Column>
        </Column>
      </form>
    </div>
  );
};

export default DelegateCard;
