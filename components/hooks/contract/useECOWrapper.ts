import { useContract, useSigner } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ECOWrapper, ECOWrapper__factory } from "../../../types/contracts";

export const useECOWrapper = (): ECOWrapper => {
  const { wEco } = useContractAddresses();
  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: wEco?.toString() || AddressZero,
    contractInterface: ECOWrapper__factory.abi,
    signerOrProvider: signer,
  });

  if (!wEco) return null;
  return contract;
};
