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
import { useMemo, useState } from "react";
import { tokensToNumber } from "../../../utilities";
import useConvertECOX from "../../hooks/useConvertECOX";
import { Zero } from "@ethersproject/constants";

import LoaderAnimation from "../Loader";
import { useConnectContext } from "../../../providers/ConnectModalProvider";
import TextLoader from "../commons/TextLoader";
import { GasFee } from "../commons/GasFee";

interface ConvertModalProps {
  ecoXBalance: BigNumber;
  exchangeRate: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Container = styled(Column)(({ theme }) => ({
  padding: "24px 16px",
  borderRadius: 4,
  backgroundColor: theme.palette.background.paper,
}));

const Note = styled(Column)(({ active }) => ({
  height: active ? 16 : 0,
  opacity: active ? 1 : 0,
  marginTop: active ? 4 : 0,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop,height opacity",
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
  setOpen,
}) => {
  const [toConvert, setToConvert] = useState<BigNumber>(Zero);
  const [error, setError] = useState<boolean>(false);
  const { convertEcoX, loading } = useConvertECOX();
  const { preventUnauthenticatedActions } = useConnectContext();

  useMemo(() => {
    toConvert && setError(toConvert.gt(ecoXBalance));
  }, [ecoXBalance, toConvert]);

  const convert = () => {
    preventUnauthenticatedActions();
    convertEcoX(toConvert, () => setOpen(false));
  };
  return (
    <Dialog
      isOpen={open}
      style={{ card: { maxWidth: 540 } }}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      onRequestClose={() => setOpen(false)}
    >
      <Column gap="xl">
        <Column gap="md" css={{ padding: "0px 16px" }}>
          <Typography variant="h2">Convert ECOx to ECO</Typography>
          <Typography variant="body1">
            At any time, you can convert your ECOx into ECO. The current
            exchange rate is {exchangeRate}. <b>Warning:</b> this action is
            irreversable, and you cannot convert ECO back into ECOx
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
          <Input
            type="number"
            min="0"
            css={inputStyle}
            value={toConvert.eq(Zero) ? "" : tokensToNumber(toConvert)}
            color={error ? "error" : "secondary"}
            onChange={(e) =>
              setToConvert(
                e.currentTarget.value === ""
                  ? Zero
                  : ethers.utils.parseEther(e.currentTarget.value)
              )
            }
            placeholder={"0.000"}
            append={
              <ButtonGroup>
                <Button
                  style={{ maxWidth: 34, height: 27, padding: 0 }}
                  variant="outline"
                  color={error ? "error" : "active"}
                  onClick={() => setToConvert(ecoXBalance)}
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  color={error ? "error" : "active"}
                  onClick={() => setToConvert(Zero)}
                >
                  Clear
                </Button>
              </ButtonGroup>
            }
          />
          <Note gap="sm" active={error} error={error}>
            <Typography variant="body2" color="error">
              You don&apos;t have enough ECOX...
            </Typography>
          </Note>
          <Row gap="md" items="center">
            <Button
              color="success"
              style={{ width: 107, marginTop: 16, marginBottom: 8 }}
              onClick={convert}
              disabled={!toConvert || loading}
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
