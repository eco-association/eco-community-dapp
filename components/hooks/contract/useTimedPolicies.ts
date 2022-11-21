import { useContract, useSigner } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import {
  TimedPolicies,
  TimedPolicies__factory,
} from "../../../types/contracts";

export const useTimedPolicies = (): TimedPolicies => {
  const { timedPolicies } = useContractAddresses();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: timedPolicies?.toString() || AddressZero,
    contractInterface: TimedPolicies__factory.abi,
    signerOrProvider: signer,
  });

  if (!timedPolicies) return null;
  return contract;
};
