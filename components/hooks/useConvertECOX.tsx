import { BigNumber } from "ethers";
import { useState } from "react";
import { toast as nativeToast } from "react-toastify";
import { useContractAddresses, useWallet } from "../../providers";
import { tokensToNumber, txError } from "../../utilities";
import { useECOx } from "./contract/useECOx";
import { ToastOptions } from "react-toastify/dist/types";
import { useAccount } from "wagmi";
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
  const wallet = useWallet();
  const account = useAccount();

  const ecoX = useECOx();
  const { sEcoX } = useContractAddresses();

  const [loading, setLoading] = useState(false);

  const convertEcoX = async (amount: BigNumber, onComplete: () => void) => {
    setLoading(true);
    try {
      const tx = await //convert fx here
      //await tx.wait();

      onComplete();
      nativeToast(
        `🚀 Converted <insert amount here> ECOx to ECO successfully`,
        successfulToastStyle
      );
      setLoading(false);
    } catch (err) {
      txError("Failed to convert ECOX", err);
    }
  };

  return { convertEcoX, loading };
};

export default useConvertECOX;
