import { AddressZero } from "@ethersproject/constants";
import {
  RandomInflation,
  RandomInflation__factory,
} from "../../../types/contracts";
import { useContractOptions } from "./useContractOptions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { getContract } from "wagmi/actions";

export const useRandomInflation = (address: string): RandomInflation => {
  const opt = useContractOptions({
    address: ConvertStringToAddress(address || AddressZero),
    abi: RandomInflation__factory.abi,
  });
  const contract = getContract(opt);
  return contract as never;
};
