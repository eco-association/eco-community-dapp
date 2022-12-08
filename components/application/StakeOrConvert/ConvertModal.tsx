import {
  Button,
  ButtonGroup,
  Column,
  Dialog,
  formatNumber,
  Input,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { BigNumber, BigNumberish, ethers } from "ethers";
import { useMemo, useState } from "react";
import { tokensToNumber } from "../../../utilities";
import { useGasFee } from "../../hooks/useGasFee";
import { Zero } from "@ethersproject/constants";
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
  const [toConvert, setToConvert] = useState<BigNumber>();
  const [error, setError] = useState<boolean>(false);

  useMemo(() => {
    toConvert && setError(toConvert.gt(ecoXBalance));
  }, [ecoXBalance, toConvert]);

  const convertEcoX = () => {
    console.log(toConvert);
  };
  return (
    <Dialog
      isOpen={open}
      style={{ card: { maxWidth: 540 } }}
      // shouldCloseOnEsc={!loading}
      // shouldShowCloseButton={!loading}
      // shouldCloseOnOverlayClick={!loading}
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
        <Container>
          <Typography variant="h5">
            {formatNumber(tokensToNumber(ecoXBalance), false)} ECOx available to
            convert
          </Typography>
          <Typography variant="body1" css={{ marginTop: 18, marginBottom: 8 }}>
            How much would you like to convert?
          </Typography>
          <Input
            type="number"
            min="0"
            css={inputStyle}
            value={tokensToNumber(toConvert)}
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
          <Button
            color="success"
            style={{ width: 107, marginTop: 16, marginBottom: 8 }}
            onClick={convertEcoX}
            disabled={!toConvert}
          >
            Convert
          </Button>
          <GasFee gasLimit={250_000} />
        </Container>
      </Column>
    </Dialog>
  );
};

export default ConvertModal;
