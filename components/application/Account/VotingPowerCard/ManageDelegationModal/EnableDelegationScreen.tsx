import { Button, Column, Row, styled, Typography } from "@ecoinc/ecomponents";
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

const Note = styled(Column)(({ active }) => ({
  height: !active && 0,
  opacity: active ? 0.5 : 0,
  marginTop: active ? 4 : 0,
  transitionDuration: "0.2s",
  transitionProperty: "marginTop,height opacity",
  border: "solid 1px #6f8eff",
  background: "rgba(111, 142, 255, 0.05)",
  borderRadius: "6px",
  padding: 16,
}));

const EnableDelegationBox: React.FC<EnableDelegationBoxProps> = ({
  back,
  onRequestClose,
}) => {
  const { state } = useDelegationState();
  const { manageBothTokens } = useManageDelegation();
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState("");

  const loading = state.eco.loading || state.secox.loading;
  const alreadyDelegating = state.eco.delegate || state.secox.delegate;

  return (
    <Column gap="xl">
      <Row gap="lg" css={{ width: "80%" }}>
        <Image
          layout="intrinsic"
          height={15}
          src={ChevronLeft}
          alt=""
          onClick={back}
          style={{
            cursor: "pointer",
          }}
        />
        <Typography variant="h2">
          Are you sure you want to become a delegate?
        </Typography>
      </Row>
      <Typography variant="body1" color="primary">
        Being a voting delegate can be a big responsibility, as others are
        trusting you with their voting power! Many delegates compete to vote
        responsibly and on an informed basis, to earn the voting trust of other
        holders. Remember, you cannot both be a delegate and also delegate
        voting power to others.
      </Typography>
      <Column gap="lg" style={{ backgroundColor: "#f6f9fb", padding: 24 }}>
        <Typography variant="body2" color="secondary">
          THINGS TO CONSIDER
        </Typography>
        <ul style={{ listStyleType: "disc", marginLeft: 24 }}>
          <li style={{ marginBottom: 12 }}>
            <Typography variant="body1">
              Making a post to the Community in the{" "}
              <a
                href="https://forums.eco.org/"
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#47b699",
                }}
              >
                Forum
              </a>{" "}
              <Typography color="secondary">(optional)</Typography>
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Mint an identity token to your wallet with your Discord or Twitter
              so people can find you more easily.
            </Typography>
          </li>
        </ul>
        {alreadyDelegating && (
          <Note gap="sm" active={true}>
            <Typography variant="body2" color="primary">
              Note: because you are currently delegating your votes to{" "}
              {displayAddress(state.eco.delegate)}, you must first undelegate
              your votes from this address to become a delegate.
            </Typography>
          </Note>
        )}
        <Row gap="lg">
          <Button color="disabled" onClick={back}>
            Go back
          </Button>
          <Button
            color="success"
            onClick={() =>
              manageBothTokens(true, false, setStep, setStatus, onRequestClose)
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
        <GasFee gasLimit={500_000} />
      </Column>
    </Column>
  );
};

export default EnableDelegationBox;
