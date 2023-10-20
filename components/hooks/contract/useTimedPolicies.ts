import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import {
  TimedPolicies,
  TimedPolicies__factory,
} from "../../../types/contracts";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { useContractOptions } from "./useContractOptions";
import { getContract } from "wagmi/actions";

export const useTimedPolicies = (): TimedPolicies => {
  const { timedPolicies } = useContractAddresses();
  const opt = useContractOptions({
    address: ConvertStringToAddress(timedPolicies?.toString() || AddressZero),
    abi: TimedPolicies__factory.abi,
  });
  const contract = getContract(opt);
  if (!timedPolicies) return null;
  return contract as never;
};
