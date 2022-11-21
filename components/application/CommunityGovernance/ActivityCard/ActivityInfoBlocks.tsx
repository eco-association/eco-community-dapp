import { Column, formatNumber, Grid, Typography } from "@ecoinc/ecomponents";
import { useMemo, useState } from "react";
import {
  Token,
  TotalTokenSupplyQueryResults,
} from "../../../../queries/TOTAL_TOKEN_SUPPLY";
import { tokensToNumber } from "../../../../utilities";

interface ActivityInfoBlocksProps {
  data: TotalTokenSupplyQueryResults;
}

const ActivityInfoBlocks: React.FC<ActivityInfoBlocksProps> = ({ data }) => {
  const [ecox, setEcox] = useState<Token>();
  const [wecox, setWecox] = useState<Token>();
  const [ratio, setRatio] = useState<string>();

  useMemo(() => {
    setEcox(data?.tokens[2]);
    setWecox(data?.tokens[1]);

    setRatio(
      `${
        parseInt(data?.tokens[2].totalSupply) /
        parseInt(data?.tokens[2].totalSupply)
      } : ${
        tokensToNumber(data?.tokens[1].totalSupply) /
        parseInt(data?.tokens[2].totalSupply)
      }`
    );
  }, [data]);

  return (
    <>
      <Grid columns="auto auto auto" gap="16px">
        <Column>
          <Typography variant="body3" color="secondary">
            {wecox?.name.toUpperCase()}
          </Typography>
          <Typography variant="h5">
            {formatNumber(tokensToNumber(wecox?.totalSupply))}
          </Typography>
        </Column>
        <Column>
          <Typography variant="body3" color="secondary">
            ECO-WECO RATE
          </Typography>
          <Typography variant="h5">{ratio}</Typography>
        </Column>
        <Column>
          <Typography variant="body3" color="secondary">
            TOTAL {ecox?.name.toUpperCase()}
          </Typography>
          <Typography variant="h5">
            {formatNumber(tokensToNumber(wecox?.totalSupply))}
          </Typography>
        </Column>
      </Grid>
      <hr />
    </>
  );
};

export default ActivityInfoBlocks;
