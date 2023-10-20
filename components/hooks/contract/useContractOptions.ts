import { GetContractArgs } from "wagmi/actions";
import { useWalletClient } from "wagmi";

export type ContractOptions<T = unknown> = T & {
  useProvider?: boolean;
};

type UseContractOptions = Pick<GetContractArgs, "address" | "abi"> & {
  options?: ContractOptions;
};

export const useContractOptions = ({
  options,
  ...contractOpts
}: UseContractOptions): GetContractArgs => {
  // const provider = usePublicClient()
  const signer = useWalletClient();
  return {
    ...contractOpts,
    ...options,
    walletClient: signer,
  };
};
