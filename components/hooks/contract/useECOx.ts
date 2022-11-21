import { useContract, useSigner } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ECOx, ECOx__factory } from "../../../types/contracts";

export const useECOx = (): ECOx => {
  const { ecoX } = useContractAddresses();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: ecoX?.toString() || AddressZero,
    contractInterface: ECOx__factory.abi,
    signerOrProvider: signer,
  });

  if (!ecoX) return null;
  return contract;
};
