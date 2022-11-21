import { useContract } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ECO, ECO__factory } from "../../../types/contracts";
import { ContractOptions, useContractOptions } from "./useContractOptions";

export const useECO = (options?: ContractOptions): ECO => {
  const { eco } = useContractAddresses();
  const opts = useContractOptions({
    addressOrName: eco?.toString() || AddressZero,
    contractInterface: ECO__factory.abi,
    options,
  });
  const contract = useContract(opts);
  if (!eco) return null;
  return contract;
};
