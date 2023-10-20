import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ECO, ECO__factory } from "../../../types/contracts";
import { ContractOptions, useContractOptions } from "./useContractOptions";
import { getContract } from "wagmi/actions";
import ConvertStringToAddress from "../../../utilities/convertAddress";

export const useECO = (options?: ContractOptions): ECO => {
  const { eco } = useContractAddresses();
  const opts = useContractOptions({
    address: ConvertStringToAddress(eco?.toString() || AddressZero),
    abi: ECO__factory.abi,
    options,
  });
  const contract = getContract(opts);
  if (!eco) return null;
  return contract as never;
};
