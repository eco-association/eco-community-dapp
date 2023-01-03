import {
  Button,
  Column,
  Row,
  styled,
  Typography,
  useTheme,
} from "@ecoinc/ecomponents";
import React, { useState } from "react";
import Image from "next/image";
import { useDelegationState } from "./provider/ManageDelegationProvider";
import { useManageDelegation } from "./hooks/useManageDelegation";
import { GasFee } from "../../../commons/GasFee";
import LoaderAnimation from "../../../Loader";
import ChevronLeft from "../../../../../public/images/chevron-left.svg";
import { Steps } from "./Steps";
import { displayAddress } from "../../../../../utilities";

interface EnableDelegationBoxProps {
  back(): void;
  onRequestClose(): void;
}

const Box = styled(Column)(({ theme }) => ({
  padding: 24,
  backgroundColor: theme.palette.background.paper,
}));

const Note = styled(Column)(({ theme, active }) => ({
  padding: 16,
  borderRadius: 6,
  height: !active && 0,
  opacity: active ? 1 : 0,
  marginTop: active ? 4 : 0,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop,height opacity",
  border: `solid 1px ${theme.palette.info.main}`,
  backgroundColor: theme.palette.info.bg,
}));

const EnableDelegationBox: React.FC<EnableDelegationBoxProps> = ({
  back,
  onRequestClose,
}) => {
  const theme = useTheme();
  const { state } = useDelegationState();
  const { manageBothTokens, undelegateBothTokens } = useManageDelegation();

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");

  const alreadyDelegating = state.eco.delegate || state.secox.delegate;
  const loading =
    state.eco.loading ||
    state.secox.loading ||
    state.eco.loadingDelegation ||
    state.secox.loadingDelegation;

  return (
    <Column gap="xl">
      <Column gap="lg">
        <Row gap="lg" css={{ width: "80%" }}>
          <div style={{ marginTop: 8 }}>
            <Image
              alt="back"
              layout="fixed"
              width={10}
              height={16}
              src={ChevronLeft}
              onClick={!loading && back}
              style={{ cursor: "pointer" }}
            />
          </div>
          <Typography variant="h2">
            Are you sure you want to become a delegate?
          </Typography>
        </Row>
        <Typography
          variant="body1"
          color="primary"
          style={{ paddingLeft: 26, paddingRight: 34 }}
        >
          Being a voting delegate can be a big responsibility, as others are
          trusting you with their voting power! Many delegates compete to vote
          responsibly and on an informed basis, to earn the voting trust of
          other holders. Remember, you cannot both be a delegate and also
          delegate voting power to others.
        </Typography>
      </Column>
      <Box gap="xl">
        <Column gap="lg">
          <Column gap="md">
            <Typography variant="subtitle1">THINGS TO CONSIDER</Typography>
            <ul style={{ listStyleType: "disc", marginLeft: 24 }}>
              <li style={{ marginBottom: 12 }}>
                <Typography variant="body1">
                  Make a post to the Community in the{" "}
                  <a
                    href="https://forums.eco.org/c/a-place-to-to-talk-about-becoming-a-delegate-in-eco/16"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Typography
                      variant="body1"
                      color="active"
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                    >
                      Forum.
                    </Typography>
                  </a>{" "}
                  <Typography color="secondary">(optional)</Typography>
                </Typography>
              </li>
              <li>
                <Typography variant="body1">
                  Mint an{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://nft.eco.id/"
                  >
                    <Typography
                      variant="body1"
                      color="active"
                      style={{ textDecoration: "underline" }}
                    >
                      Eco ID
                    </Typography>
                  </a>{" "}
                  to your wallet connected your Discord or Twitter so people can
                  find you easily.
                </Typography>
              </li>
            </ul>
          </Column>
          {alreadyDelegating ? (
            <Note active gap="sm">
              <Typography
                variant="body2"
                color="primary"
                style={{ lineHeight: 1, fontWeight: 500 }}
              >
                Note: because you are currently delegating your votes to{" "}
                {displayAddress(state.eco.delegate || state.secox.delegate)},
                you must first undelegate your votes from this address to become
                a delegate.
              </Typography>
            </Note>
          ) : null}
        </Column>
        <Column gap="md">
          <Row gap="lg">
            {!loading ? (
              <Button
                color="disabled"
                style={{ color: theme.palette.primary.main }}
                onClick={back}
              >
                Go back
              </Button>
            ) : null}
            <Button
              color="success"
              disabled={loading}
              style={{ minWidth: "initial" }}
              onClick={() =>
                alreadyDelegating
                  ? undelegateBothTokens(setStep, setStatus, onRequestClose)
                  : manageBothTokens(
                      true,
                      false,
                      setStep,
                      setStatus,
                      onRequestClose
                    )
              }
            >
              {loading ? (
                <LoaderAnimation />
              ) : !alreadyDelegating ? (
                "Become a delegate"
              ) : (
                "Undelegate"
              )}
            </Button>
            {loading && (
              <Steps status={status} currentStep={step} totalSteps={2} />
            )}
          </Row>
          <GasFee gasLimit={160_000} />
        </Column>
      </Box>
    </Column>
  );
};

export default EnableDelegationBox;
