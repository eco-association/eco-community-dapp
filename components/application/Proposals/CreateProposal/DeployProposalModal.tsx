import {
  Alert,
  Button,
  Column,
  Dialog,
  FormTextField,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import React, { useEffect, useState } from "react";
import useDeployProposal from "../../../hooks/useDeployProposal";
import { useGasFee } from "../../../hooks/useGasFee";
import LoaderAnimation from "../../Loader";
import { useBlockExit } from "../../../hooks/useBlockExit";
import { SelectContract } from "./SelectContract";
import { useForm } from "react-hook-form";
import { ethers } from "ethers";
import useResponsiveDialog from "../../../hooks/useResponsiveDialog";

interface DeployProposalModalProps {
  action: ProposalAction;
  code?: string;
  address?: string;

  onRequestClose(): void;
}

export enum ProposalAction {
  None,
  Submit,
  Resubmit,
  DeployAndSubmit,
}

const Top = styled(Column)({ padding: "0 24px" });
const lineHeight = css({ lineHeight: "20.25px" });

function getTitle(action: ProposalAction) {
  if (action === ProposalAction.Resubmit) return "Resubmit this proposal";
  if (action === ProposalAction.Submit) return "Submit your Proposal";
  return "Submit your Proposal";
}

function getDescription(action: ProposalAction) {
  if (action === ProposalAction.Resubmit)
    return "Resubmit this proposal to give it another chance to gain support and proceed to a vote.";
  if (action === ProposalAction.Submit)
    return "Submitting here will approve and transfer ECO to pay the submission fee and then register your proposal to the governance system.";
  return "Eco governance proposals are deployed as smart contracts. As a result, you will need to approve the ECO submission fee through your connected wallet as well as the required Ethereum network gas fee.";
}

function getButtonText(action: ProposalAction) {
  if (action === ProposalAction.Resubmit) return "Resubmit";
  if (action === ProposalAction.Submit) return "Submit";
  return "Deploy & Submit";
}

const AVERAGE_DEPLOY_TX_GAS_LIMIT = 500_000;
const SUBMIT_TX_GAS_LIMIT = 274_094;
const APPROVE_TX_GAS_LIMIT = 51_389;

const DeployProposalModal: React.FC<DeployProposalModalProps> = ({
  action,
  code,
  onRequestClose,
  address: resubmitAddress,
}) => {
  const dialogStyles = useResponsiveDialog(500);

  const [contract, setContract] = useState<keyof typeof compilation>();

  const {
    submitProposal,
    deployAndSubmitProposal,

    status,
    loading,
    compiling,
    compileProposal,
    listTransactions,

    compilation,
    compilationErrors,
  } = useDeployProposal();

  useBlockExit(loading);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<{ proposalAddress: string }>({
    defaultValues: { proposalAddress: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (action === ProposalAction.DeployAndSubmit) compileProposal(code);
  }, [action, code, compileProposal]);

  const submit = () => {
    if (action === ProposalAction.Resubmit) {
      submitProposal(resubmitAddress);
    } else if (action === ProposalAction.Submit) {
      handleSubmit(({ proposalAddress }) => submitProposal(proposalAddress))();
    } else {
      deployAndSubmitProposal(compilation[contract]);
    }
  };

  const deployGasLimit =
    action === ProposalAction.DeployAndSubmit ? AVERAGE_DEPLOY_TX_GAS_LIMIT : 0;
  const gasFee = useGasFee(
    APPROVE_TX_GAS_LIMIT + SUBMIT_TX_GAS_LIMIT + deployGasLimit
  );

  const currentStep = listTransactions.findIndex((tx) => tx === status) + 1;

  const disabled =
    loading ||
    compiling ||
    (action === ProposalAction.Submit && !isValid) ||
    (action === ProposalAction.DeployAndSubmit &&
      (!contract || !!compilationErrors.length));

  return (
    <Dialog
      isOpen={action !== ProposalAction.None}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      onRequestClose={onRequestClose}
      style={dialogStyles}
    >
      <Column gap="xl">
        <Top gap="lg">
          <Typography variant="h2">{getTitle(action)}</Typography>
          {compilationErrors.length ? (
            <Alert title="Compilation Errors">
              <ul className="list-disc ml-4">
                {compilationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            </Alert>
          ) : null}
          <Typography variant="body1" css={lineHeight}>
            {getDescription(action)}
          </Typography>
          <Column items="left" gap="md">
            {action === ProposalAction.DeployAndSubmit ? (
              <SelectContract
                disabled={loading}
                contract={contract}
                compilation={compilation}
                onChange={setContract}
              />
            ) : null}
            {action === ProposalAction.Submit ? (
              <FormTextField
                label="Proposal Address"
                control={control}
                color="secondary"
                name="proposalAddress"
                placeholder="Proposal Address"
                rules={{ required: true, validate: ethers.utils.isAddress }}
              />
            ) : null}
            <Row items="center" gap="lg">
              <Button color="success" onClick={submit} disabled={disabled}>
                {loading ? <LoaderAnimation /> : getButtonText(action)}
              </Button>
              {compiling ? (
                <Typography
                  variant="body2"
                  color="secondary"
                  style={{ opacity: 0.5 }}
                >
                  Compiling contract...
                </Typography>
              ) : loading && status ? (
                <Column>
                  <Typography variant="body3" color="secondary">
                    STEP {currentStep} OF {listTransactions.length}
                  </Typography>
                  <Typography variant="body2" color="active">
                    {status}
                  </Typography>
                </Column>
              ) : null}
            </Row>
            <Typography variant="body3">
              Estimated Gas Fee:{" "}
              <Typography variant="body3" color="secondary">
                {gasFee} ETH &bull;{" "}
                {listTransactions.length ||
                  (action === ProposalAction.DeployAndSubmit ? 3 : 2)}{" "}
                Transactions
              </Typography>
            </Typography>
          </Column>
        </Top>
      </Column>
    </Dialog>
  );
};

export default DeployProposalModal;
