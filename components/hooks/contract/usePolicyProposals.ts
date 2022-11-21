import { useContract, useSigner } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import {
  PolicyProposals,
  PolicyProposals__factory,
} from "../../../types/contracts";

export const usePolicyProposals = (address?: string): PolicyProposals => {
  const { policyProposals } = useContractAddresses();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: address || policyProposals?.toString() || AddressZero,
    contractInterface: PolicyProposals__factory.abi,
    signerOrProvider: signer,
  });

  if (!policyProposals) return null;
  return contract;
};
