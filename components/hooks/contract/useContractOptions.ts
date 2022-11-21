import { GetContractArgs } from "@wagmi/core";
import { useProvider, useSigner } from "wagmi";

export type ContractOptions<T = unknown> = T & {
  useProvider?: boolean;
};

type UseContractOptions = Pick<
  GetContractArgs,
  "addressOrName" | "contractInterface"
> & {
  options?: ContractOptions;
};

export const useContractOptions = ({
  options,
  ...contractOpts
}: UseContractOptions): GetContractArgs => {
  const { data: signer } = useSigner();
  const provider = useProvider();
  return {
    ...contractOpts,
    signerOrProvider: options?.useProvider ? provider : signer,
  };
};
