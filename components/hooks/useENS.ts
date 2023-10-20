import { useEffect, useState } from "react";
import { useEthersProvider } from "../../providers/EthersProvider";

export const useENS = (address?: string): string | null => {
  const provider = useEthersProvider();
  const [name, setName] = useState<string>(null);

  useEffect(() => {
    const getName = async () => {
      if (!address) return;
      const resolvedName = await provider.lookupAddress(address);
      if (resolvedName) setName(resolvedName);
    };
    getName();
  }, [address, provider]);

  return name;
};
