import { useEffect, useState } from "react";
import { useProvider } from "wagmi";

export const useENS = (address?: string): string | null => {
  const provider = useProvider();
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
