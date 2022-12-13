import { AddressZero } from "@ethersproject/constants";
import { useContract, useSigner } from "wagmi";
import {
  RandomInflation,
  RandomInflation__factory,
} from "../../../types/contracts";

export const useRandomInflation = (address: string): RandomInflation => {
  const { data: signer } = useSigner();
  return useContract({
    addressOrName: address || AddressZero,
    contractInterface: RandomInflation__factory.abi,
    signerOrProvider: signer,
  });
};
