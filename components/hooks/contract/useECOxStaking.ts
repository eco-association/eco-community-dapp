import { useContract } from "wagmi";
import { ECOxStaking, ECOxStaking__factory } from "../../../types/contracts";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ContractOptions, useContractOptions } from "./useContractOptions";

export const useECOxStaking = (options?: ContractOptions): ECOxStaking => {
  const { sEcoX } = useContractAddresses();
  const opts = useContractOptions({
    addressOrName: sEcoX?.toString() || AddressZero,
    contractInterface: ECOxStaking__factory.abi,
    options,
  });
  const contract = useContract(opts);
  if (!sEcoX) return null;
  return contract;
};
