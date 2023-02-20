import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useProvider } from "wagmi";
import { Color, Input, InputProps } from "@ecoinc/ecomponents";
import { ethers } from "ethers";

interface InputAddressProps
  extends Omit<
    InputProps,
    "color" | "type" | "min" | "onChange" | "as" | "ref"
  > {
  color?: Color;
  value?: string;

  onChange(address: string): void;
}

let timeout;

const record: Record<string, string> = {};

const InputAddress: React.FC<InputAddressProps> = ({
  value: address,
  onChange: onEmitChange,
  ...props
}) => {
  const [idle, setIdle] = useState(false);

  const provider = useProvider();
  const { data } = useQuery(
    ["ens", address],
    async () => [address, await provider.resolveName(address)],
    { enabled: !idle && !ethers.utils.isAddress(address) }
  );

  const [ens, ensAddress] = data || [];

  useEffect(() => {
    clearTimeout(timeout);
    setIdle(true);
    timeout = setTimeout(() => setIdle(false), 500);
  }, [address]);

  const onChange = (e) => {
    e.preventDefault();
    onEmitChange(e.target.value);
  };

  useEffect(() => {
    if (ensAddress && ens === address) {
      record[ensAddress] = ens;
      onEmitChange(ensAddress);
    }
  }, [address, ens, ensAddress, onEmitChange]);

  return (
    <Input
      {...props}
      type="text"
      value={record[address] || address}
      onChange={onChange}
    />
  );
};

export default InputAddress;
