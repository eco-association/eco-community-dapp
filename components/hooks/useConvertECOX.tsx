import { BigNumber } from "ethers";
import { useState } from "react";
import { toast as nativeToast } from "react-toastify";
import { tokensToNumber, txError } from "../../utilities";
import { useECOx } from "./contract/useECOx";
import { ToastOptions } from "react-toastify/dist/types";
import { formatNumber } from "@ecoinc/ecomponents";

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

  const [loading, setLoading] = useState(false);

  const convertEcoX = async (amount: BigNumber, onComplete: () => void) => {
    setLoading(true);
    try {
      const tx = await ecoX.exchange(amount);
      await tx.wait(2);

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

  return { convertEcoX, loading };
};

export default useConvertECOX;
