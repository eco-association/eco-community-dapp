import { Proposal, Proposal__factory } from "../../../types/contracts";
import { useContractOptions } from "./useContractOptions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { getContract } from "wagmi/actions";

export const useProposalContract = (address: string): Proposal => {
  const opt = useContractOptions({
    address: ConvertStringToAddress(address),
    abi: Proposal__factory.abi,
  });
  const contract = getContract(opt);
  return contract as never;
};
