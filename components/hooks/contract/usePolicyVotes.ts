import { useContract, useSigner } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { PolicyVotes, PolicyVotes__factory } from "../../../types/contracts";

export const usePolicyVotes = (): PolicyVotes => {
  const { policyVotes } = useContractAddresses();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: policyVotes?.toString() || AddressZero,
    contractInterface: PolicyVotes__factory.abi,
    signerOrProvider: signer,
  });

  if (!policyVotes) return null;
  return contract;
};
