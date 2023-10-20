import { useContractAddresses } from "../../../providers";
import { AddressZero } from "@ethersproject/constants";
import {
  PolicyProposals,
  PolicyProposals__factory,
} from "../../../types/contracts";
import { useContractOptions } from "./useContractOptions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { getContract } from "wagmi/actions";

export const usePolicyProposals = (address?: string): PolicyProposals => {
  const { policyProposals } = useContractAddresses();
  const opt = useContractOptions({
    address: ConvertStringToAddress(
      address || policyProposals?.toString() || AddressZero
    ),
    abi: PolicyProposals__factory.abi,
  });
  const contract = getContract(opt);
  if (!policyProposals) return null;
  return contract as never;
};
