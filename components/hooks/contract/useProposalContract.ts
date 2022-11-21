import { useContract, useSigner } from "wagmi";
import { Proposal, Proposal__factory } from "../../../types/contracts";

export const useProposalContract = (address: string): Proposal => {
  const { data: signer } = useSigner();
  return useContract({
    addressOrName: address,
    contractInterface: Proposal__factory.abi,
    signerOrProvider: signer,
  });
};
