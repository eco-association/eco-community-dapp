import { useContract, useSigner } from "wagmi";
import { Lockup, Lockup__factory } from "../../../types/contracts";

export const useLockup = (address: string): Lockup => {
  const { data: signer } = useSigner();
  return useContract({
    addressOrName: address,
    contractInterface: Lockup__factory.abi,
    signerOrProvider: signer,
  });
};
