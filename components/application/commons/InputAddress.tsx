import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useEnsName } from "wagmi";
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
  const ensAddString = address.startsWith("0x")
    ? address.split("0x")[1]
    : address;
  const { data: ensName } = useEnsName({ address: `0x${ensAddString}` });
  const { data } = useQuery(["ens", address], async () => [address, ensName], {
    enabled: !idle && !ethers.utils.isAddress(address),
  });

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
