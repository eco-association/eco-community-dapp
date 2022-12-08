import React from "react";
import { useGasFee } from "../../hooks/useGasFee";
import { Typography, TypographyProps } from "@ecoinc/ecomponents";

interface GasFeeProps extends TypographyProps {
  gasLimit: number;
  amountStyle?: TypographyProps;
}

export const GasFee: React.FC<GasFeeProps> = ({
  gasLimit,
  amountStyle,
  ...props
}) => {
  const gasFee = useGasFee(gasLimit);
  return (
    <Typography variant="body3" {...props}>
      Estimated Gas Fee:{" "}
      <Typography variant="body3" color="secondary" {...props} {...amountStyle}>
        {gasFee} ETH
      </Typography>
    </Typography>
  );
};
