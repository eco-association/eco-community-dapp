import { useEffect, useMemo, useState } from "react";
import { One, Zero } from "@ethersproject/constants";
import { BigNumberish, ethers } from "ethers";
import ethProvider from "../../utilities/ethProvider";

const gasFormatter = new Intl.NumberFormat("en-US", {
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 3,
});

let globalGasPrice = Zero;
async function fetchGasPrice() {
  globalGasPrice = (await ethProvider.getFeeData()).maxFeePerGas;
}

setInterval(fetchGasPrice, 60000);
fetchGasPrice();

export const useGasFee = (gas: BigNumberish = One) => {
  const [gasPrice, setGasPrice] = useState(globalGasPrice);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gasPrice.eq(globalGasPrice)) setGasPrice(globalGasPrice);
    }, 30000);
    return () => clearInterval(interval);
  }, [gasPrice]);

  return useMemo(
    () =>
      gasFormatter.format(
        parseFloat(ethers.utils.formatEther(gasPrice.mul(gas)))
      ),
    [gas, gasPrice]
  );
};
