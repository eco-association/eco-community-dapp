import { useContract, useSigner } from "wagmi";
import { TrustedNodes, TrustedNodes__factory } from "../../../types/contracts";
import { useContractAddresses } from "../../../providers";

export const useTrustedNodesContract = (): TrustedNodes => {
  const { trustedNodes } = useContractAddresses();
  const { data: signer } = useSigner();
  return useContract({
    addressOrName: trustedNodes.toString(),
    contractInterface: TrustedNodes__factory.abi,
    signerOrProvider: signer,
  });
};
