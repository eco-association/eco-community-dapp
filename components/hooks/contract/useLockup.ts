import { Lockup, Lockup__factory } from "../../../types/contracts";
import { getContract } from "wagmi/actions";
import ConvertStringToAddress from "../../../utilities/convertAddress";
import { useContractOptions } from "./useContractOptions";

export const useLockup = (address: string): Lockup => {
  const opt = useContractOptions({
    address: ConvertStringToAddress(address),
    abi: Lockup__factory.abi,
  });
  const contract = getContract(opt);
  if (!contract) return null;
  return contract as never;
};
