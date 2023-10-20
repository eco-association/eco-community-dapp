import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ECOx, ECOx__factory } from "../../../types/contracts";
import { getContract } from "wagmi/actions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { useWalletClient } from "wagmi";

export const useECOx = (): ECOx => {
  const { ecoX } = useContractAddresses();
  const signer = useWalletClient();
  const contract = getContract({
    address: ConvertStringToAddress(ecoX?.toString() || AddressZero),
    abi: ECOx__factory.abi,
    walletClient: signer,
  });
  if (!ecoX) return null;
  return contract as never;
};
