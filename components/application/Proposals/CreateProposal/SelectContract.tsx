import React, { useEffect } from "react";
import { Column, Typography } from "@ecoinc/ecomponents";
import { Select } from "../../commons/Select";
import { CompiledContract } from "../../../../types/CompiledContract";

interface SelectContractProps {
  disabled?: boolean;
  contract?: string;
  compilation: Record<string, CompiledContract>;
  onChange(contract: string): void;
}

function getBiggestContract(
  compilation: Record<string, CompiledContract>
): string | undefined {
  const entries = Object.entries(compilation);
  if (entries.length) {
    // Pre-select the biggest contract
    const selected = entries.reduce((selected, contract) => {
      if (
        contract[1].evm.bytecode.object.length >
        selected[1].evm.bytecode.object.length
      )
        return contract;
      return selected;
    }, entries[0]);
    return selected[0];
  }
}

export const SelectContract: React.FC<SelectContractProps> = ({
  compilation,
  contract,
  onChange,
  disabled,
}) => {
  useEffect(() => {
    onChange(getBiggestContract(compilation));
  }, [compilation, onChange]);

  const contractList = Object.keys(compilation);
  if (contractList.length < 2) return;

  return (
    <Column items="left" gap="md">
      <Typography variant="h6" style={{ fontSize: 13, lineHeight: 1 }}>
        Select contract to deploy
      </Typography>
      <Select
        value={contract}
        disabled={disabled}
        onChange={(evt) => onChange((evt.target as HTMLSelectElement).value)}
      >
        {contractList.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </Select>
    </Column>
  );
};
