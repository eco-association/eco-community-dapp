import {
  Button,
  Column,
  Dialog,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { BigNumber } from "ethers";
import React, { useMemo, useState } from "react";
import { tokensToNumber } from "../../../../utilities";
import useConvertECOX from "../../../hooks/useConvertECOX";
import { WeiPerEther, Zero } from "@ethersproject/constants";

import LoaderAnimation from "../../Loader";
import TextLoader from "../../commons/TextLoader";
import { GasFee } from "../../commons/GasFee";
import InputTokenAmount from "../../commons/InputTokenAmount";

interface ConvertModalProps {
  ecoXBalance: BigNumber;
  exchangeRate: BigNumber;
  open: boolean;

  onClose(): void;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "8px 16px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const Note = styled(Column)<{ active: boolean }>(({ active }) => ({
  height: active ? 16 : 0,
  opacity: active ? 1 : 0,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop height opacity",
}));

const ConvertModal: React.FC<ConvertModalProps> = ({
  ecoXBalance,
  exchangeRate,
  open,
  onClose,
}) => {
  const { convertEcoX, loading } = useConvertECOX();

  const [toConvert, setToConvert] = useState(Zero);

  const error = useMemo(
    () => toConvert && toConvert.gt(ecoXBalance),
    [ecoXBalance, toConvert]
  );

  const convert = () => convertEcoX(toConvert, onClose);

  return (
    <Dialog
      isOpen={open}
      style={{ card: { maxWidth: 540 } }}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      onRequestClose={onClose}
    >
      <Column gap="xl">
        <Column gap="lg" css={{ padding: "0px 16px" }}>
          <Typography variant="h2">Convert ECOx to ECO</Typography>
          <Typography variant="body1">
            You can permanently burn your ECOx to mint new ECO at any time. This
            removes ECOx forever from the global supply. The current conversion
            rate is <b>1:{formatNumber(tokensToNumber(exchangeRate))}.</b>
          </Typography>
          <Typography variant="body1" color="error">
            <b>Warning:</b> this action is irreversible, and you cannot convert
            ECO back into ECOx.
          </Typography>
        </Column>
        <Container gap="md">
          <Typography variant="h5">
            {formatNumber(tokensToNumber(ecoXBalance), false)} ECOx available to
            convert
          </Typography>
          <Typography variant="body1">
            How much would you like to convert?
          </Typography>
          <Column gap="sm">
            <InputTokenAmount
              placeholder="0.000"
              value={toConvert}
              maxValue={ecoXBalance}
              onChange={setToConvert}
              color={error ? "error" : "secondary"}
            />
            <Note gap="sm" active={error}>
              <Typography variant="body3" color="error">
                You don&apos;t have enough ECOX...
              </Typography>
            </Note>
            <Note gap="sm" active={!toConvert.isZero() && !error}>
              <Typography variant="body3" color="secondary">
                Worth{" "}
                {formatNumber(
                  tokensToNumber(exchangeRate.mul(toConvert).div(WeiPerEther))
                )}{" "}
                ECO
              </Typography>
            </Note>
          </Column>
          <Row gap="md" items="center">
            <Button
              color="success"
              onClick={convert}
              disabled={!toConvert || loading || error || toConvert.isZero()}
            >
              {loading ? <LoaderAnimation /> : "Convert"}
            </Button>
            {loading && <TextLoader />}
          </Row>
          <GasFee gasLimit={163_144} />
        </Container>
      </Column>
    </Dialog>
  );
};

export default ConvertModal;
