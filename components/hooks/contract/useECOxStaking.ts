import { ECOxStaking, ECOxStaking__factory } from "../../../types/contracts";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ContractOptions, useContractOptions } from "./useContractOptions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { getContract } from "wagmi/actions";

export const useECOxStaking = (options?: ContractOptions): ECOxStaking => {
  const { sEcoX } = useContractAddresses();
  const opts = useContractOptions({
    address: ConvertStringToAddress(sEcoX?.toString() || AddressZero),
    abi: ECOxStaking__factory.abi,
    options,
  });
  const contract = getContract(opts);
  if (!sEcoX) return null;
  return contract as never;
};
