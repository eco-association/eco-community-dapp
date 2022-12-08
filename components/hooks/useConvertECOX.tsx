import { BigNumber } from "ethers";
import { useState } from "react";
import { toast as nativeToast } from "react-toastify";
import { tokensToNumber, txError } from "../../utilities";
import { useECOx } from "./contract/useECOx";
import { ToastOptions } from "react-toastify/dist/types";
import { formatNumber } from "@ecoinc/ecomponents";
import { useWallet } from "../../providers";
import { WalletActionType } from "../../providers/WalletProvider";

const successfulToastStyle: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  theme: "colored",
  style: {
    backgroundColor: "#F7FEFC",
    border: "solid 1px #5AE4BF",
    color: "#22313A",
    top: "7.19em",
  },
};

const useConvertECOX = () => {
  const ecoX = useECOx();
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);

  const getValueOfEcoX = async (amount: BigNumber) => {
    const y = await ecoX.ecoValueOf(amount);
    return formatNumber(tokensToNumber(y));
  };

  const convertEcoX = async (amount: BigNumber, onComplete: () => void) => {
    setLoading(true);
    try {
      const value = await ecoX.ecoValueOf(amount);
      const tx = await ecoX.exchange(amount);
      await tx.wait();
      wallet.dispatch({
        type: WalletActionType.Convert,
        ecoXAmount: amount,
        ecoAmount: value,
      });

      onComplete();
      nativeToast(
        `🚀 Converted ${formatNumber(
          tokensToNumber(amount)
        )} ECOx to ECO successfully`,
        successfulToastStyle
      );
      setLoading(false);
    } catch (err) {
      txError("Failed to convert ECOX", err);
      setLoading(false);
    }
  };

  return { convertEcoX, loading, getValueOfEcoX };
};

export default useConvertECOX;
