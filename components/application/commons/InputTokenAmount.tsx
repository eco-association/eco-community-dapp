import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Color,
  Input,
  TypographyProps,
} from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { BigNumber, ethers } from "ethers";
import { Zero } from "@ethersproject/constants";
import { tokensToNumber } from "../../../utilities";

interface InputTokenAmountProps
  extends Omit<
    TypographyProps,
    "value" | "color" | "type" | "min" | "onChange" | "as"
  > {
  color?: Color;
  value?: BigNumber;
  maxValue?: BigNumber;
  showNoneButton?: boolean;

  onChange(amount: BigNumber): void;
}

const inputStyle = css({
  "&::placeholder": {
    opacity: 0.7,
    color: "#5F869F",
  },
});

function storeAmount(amount: BigNumber, enforceZero = false) {
  return {
    big: amount,
    float:
      amount.isZero() && !enforceZero ? "" : tokensToNumber(amount).toString(),
  };
}

const InputTokenAmount: React.FC<InputTokenAmountProps> = ({
  maxValue,
  showNoneButton,
  value = Zero,
  onChange: onEmitChange,
  ...props
}) => {
  const [amount, setAmount] = useState(storeAmount(value));

  useEffect(() => {
    if (!value.eq(amount.big)) setAmount(storeAmount(value));
  }, [amount.big, value]);

  const _update = (amount: BigNumber, enforceZero = false) => {
    const values = storeAmount(amount, enforceZero);
    setAmount(values);
    onEmitChange(values.big);
  };

  const onChange = (e) => {
    e.preventDefault();
    try {
      const { value } = e.target;
      const big = value === "" ? Zero : ethers.utils.parseEther(value);
      setAmount({ big, float: e.target.value });
      onEmitChange(big);
    } catch (e) {}
  };

  return (
    <Input
      {...props}
      min="0"
      type="number"
      css={inputStyle}
      onChange={onChange}
      value={amount.float}
      max={maxValue && tokensToNumber(maxValue).toString()}
      append={
        maxValue || showNoneButton ? (
          <ButtonGroup>
            {maxValue ? (
              <Button
                variant="outline"
                color={props.color}
                onClick={() => _update(maxValue)}
              >
                All
              </Button>
            ) : null}
            {showNoneButton ? (
              <Button
                variant="outline"
                color={props.color}
                onClick={() => _update(Zero, true)}
              >
                None
              </Button>
            ) : null}
          </ButtonGroup>
        ) : undefined
      }
    />
  );
};

export default InputTokenAmount;
