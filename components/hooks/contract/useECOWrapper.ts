import { useWalletClient } from "wagmi";
import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { ECOWrapper, ECOWrapper__factory } from "../../../types/contracts";
import { getContract } from "wagmi/actions";
import ConvertStringToAddress from "../../../utilities/convertAddress";

export const useECOWrapper = (): ECOWrapper => {
  const { wEco } = useContractAddresses();
  const signer = useWalletClient();
  const contract = getContract({
    address: ConvertStringToAddress(wEco?.toString() || AddressZero),
    abi: ECOWrapper__factory.abi,
    walletClient: signer,
  });
  if (!wEco) return null;
  return contract as never;
};
