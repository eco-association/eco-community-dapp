import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  BASE_INFLATION,
  BaseInflationQueryResult,
} from "../../queries/BASE_INFLATION";
import { BigNumberish } from "ethers";
import { tokensToNumber } from "../../utilities";
import { WeiPerEther } from "@ethersproject/constants";

function calcPercentage(numerator?: BigNumberish, base?: BigNumberish) {
  if (!numerator || !base) return 0;
  const _numerator = tokensToNumber(numerator);
  const _base = tokensToNumber(base);
  return _numerator / _base - 1;
}

export const useBaseInflation = (block: string | number) => {
  const [percentage, setPercentage] = useState(0);
  const [getInflationMultipliers, { data }] =
    useLazyQuery<BaseInflationQueryResult>(BASE_INFLATION);

  useEffect(() => {
    if (block) {
      getInflationMultipliers({ variables: { block } });
    }
  }, [block, getInflationMultipliers]);

  useEffect(() => {
    if (data) {
      const {
        previous: [prev],
        current: [curr],
      } = data;
      setPercentage(calcPercentage(prev?.value || WeiPerEther, curr?.value));
    }
  }, [data]);

  return percentage;
};
