import { TrustedNodes, TrustedNodes__factory } from "../../../types/contracts";
import { useContractAddresses } from "../../../providers";
import { useContractOptions } from "./useContractOptions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { getContract } from "wagmi/actions";

export const useTrustedNodesContract = (): TrustedNodes => {
  const { trustedNodes } = useContractAddresses();

  const opt = useContractOptions({
    address: ConvertStringToAddress(trustedNodes.toString()),
    abi: TrustedNodes__factory.abi,
  });

  const contract = getContract(opt);
  return contract as never;
};
