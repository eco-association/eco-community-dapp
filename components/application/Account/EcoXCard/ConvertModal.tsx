import {
  Button,
  ButtonGroup,
  Column,
  Dialog,
  formatNumber,
  Input,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { BigNumber, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { tokensToNumber } from "../../../../utilities";
import useConvertECOX from "../../../hooks/useConvertECOX";
import { WeiPerEther, Zero } from "@ethersproject/constants";

import LoaderAnimation from "../../Loader";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import TextLoader from "../../commons/TextLoader";
import { GasFee } from "../../commons/GasFee";

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

const inputStyle = css({
  "&::placeholder": {
    opacity: 0.7,
    color: "#5F869F",
  },
});

const ConvertModal: React.FC<ConvertModalProps> = ({
  ecoXBalance,
  exchangeRate,
  open,
  onClose,
}) => {
  const { convertEcoX, loading } = useConvertECOX();
  const { preventUnauthenticatedActions } = useConnectContext();

  const [error, setError] = useState(false);
  const [toConvert, setToConvert] = useState<BigNumber>(Zero);

  useEffect(() => {
    toConvert && setError(toConvert.gt(ecoXBalance));
  }, [ecoXBalance, toConvert]);

  const convert = () => {
    if (preventUnauthenticatedActions()) {
      convertEcoX(toConvert, onClose);
    }
  };

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
        <Column gap="md" css={{ padding: "0px 16px" }}>
          <Typography variant="h2">Convert ECOx to ECO</Typography>
          <Typography variant="body1">
            At any time, you can convert your ECOx into ECO. The current
            exchange rate is {formatNumber(tokensToNumber(exchangeRate))}:1.{" "}
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
            <Input
              style={{ padding: 0 }}
              type="number"
              min="0"
              placeholder="0.000"
              css={inputStyle}
              color={error ? "error" : "secondary"}
              value={toConvert.isZero() ? "" : tokensToNumber(toConvert)}
              onChange={(e) =>
                setToConvert(
                  e.currentTarget.value === ""
                    ? Zero
                    : ethers.utils.parseEther(e.currentTarget.value)
                )
              }
              append={
                <ButtonGroup>
                  <Button
                    variant="outline"
                    color={error ? "error" : "active"}
                    onClick={() => setToConvert(ecoXBalance)}
                  >
                    All
                  </Button>
                </ButtonGroup>
              }
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
