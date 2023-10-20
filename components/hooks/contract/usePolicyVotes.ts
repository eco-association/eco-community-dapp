import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import { PolicyVotes, PolicyVotes__factory } from "../../../types/contracts";
import { useContractOptions } from "./useContractOptions";
import { getContract } from "wagmi/actions";
import ConvertStringToAddress from "../../../utilities/convertAddress";

export const usePolicyVotes = (): PolicyVotes => {
  const { policyVotes } = useContractAddresses();

  const opt = useContractOptions({
    address: ConvertStringToAddress(policyVotes?.toString() || AddressZero),
    abi: PolicyVotes__factory.abi,
  });
  const contract = getContract(opt);
  if (!policyVotes) return null;
  return contract as never;
};
