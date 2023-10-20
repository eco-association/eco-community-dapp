import { TopBar } from "../commons/TopBar";
import { useProposalRefund } from "../../hooks/useProposalRefund";
import { BigNumber } from "ethers";
import { Zero } from "@ethersproject/constants";
import {
  Button,
  Column,
  Dialog,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import {
  breakpoints,
  displayAddress,
  mq,
  tokensToNumber,
} from "../../../utilities";
import React, { useState } from "react";
import { useGasFee } from "../../hooks/useGasFee";
import { useAccount } from "wagmi";
import { PolicyProposals__factory } from "../../../types/contracts";
import { truncateText } from "../../../utilities";
import useResponsiveDialog from "../../hooks/useResponsiveDialog";
import { useEthersSigner } from "../../../providers/EthSigners";

const Box = styled(Column)(({ theme }) => ({
  padding: "16px 24px",
  backgroundColor: theme.palette.disabled.bg,
}));
const Content = styled(Column)({ padding: "0 24px" });
const StyledRow = styled(Row)({
  flexDirection: "column",
  [mq(breakpoints.md)]: {
    flexDirection: "row",
  },
});

const REFUND_GAS_LIMIT = 149_038;

export const RefundNotification: React.FC = () => {
  const account = useAccount();
  const dialogStyles = useResponsiveDialog(524);

  const { proposals, reset, remove } = useProposalRefund();
  const signer = useEthersSigner();
  const gasFee = useGasFee(REFUND_GAS_LIMIT);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const total = proposals
    .map((proposal) => proposal.generation.policyProposal.refundIfLost)
    .map(BigNumber.from)
    .reduce((refund, acc) => acc.add(refund), Zero);

  if (!proposals.length || !account.address || total.isZero()) return null;

  const claim = async () => {
    setLoading(true);
    try {
      for (const proposal of proposals) {
        const tx = await PolicyProposals__factory.connect(
          proposal.generation.policyProposal.address,
          signer
        ).refund(proposal.address);
        await tx.wait();
        remove(proposal);
      }
      reset();
    } catch (err) {}
    setLoading(false);
  };

  return (
    <React.Fragment>
      <TopBar onClick={() => setOpen(true)}>
        You have proposal refunds{" "}
        <b style={{ textDecoration: "underline" }}>to claim</b>.
      </TopBar>
      <Dialog
        isOpen={open}
        shouldCloseOnEsc={!loading}
        shouldShowCloseButton={!loading}
        shouldCloseOnOverlayClick={!loading}
        onRequestClose={() => setOpen(false)}
        style={dialogStyles}
      >
        <Column gap="xl">
          <Content gap="lg">
            <Typography variant="h2">Claim your ECO refund</Typography>
            <Typography variant="body1">
              {proposals.length === 1 ? (
                <>
                  Your proposal <b>{truncateText(proposals[0].name, 105)}</b>{" "}
                  did not receive enough support to advance to the voting stage.
                  You may claim a submission fee refund of{" "}
                  {formatNumber(tokensToNumber(total))} ECO
                </>
              ) : (
                <>
                  You have <b>{proposals.length} Proposals</b> that did not
                  receive enough support to advance to the voting stage. You may
                  claim a submission fee refund of{" "}
                  {formatNumber(tokensToNumber(total))} ECO
                </>
              )}
            </Typography>
          </Content>
          <Box gap="lg">
            <StyledRow gap="sm">
              <Typography variant="body1">Move to your wallet </Typography>
              <Typography variant="body1" color="secondary">
                Eth Address {displayAddress(account.address)}
              </Typography>
            </StyledRow>
            <Column gap="md" items="start">
              <Button color="success" onClick={claim} disabled={loading}>
                {!loading ? "Claim" : "Claiming..."}
              </Button>
              <Typography variant="body3">
                Estimated Gas Fee:{" "}
                <Typography variant="body3" color="secondary">
                  {gasFee} ETH
                </Typography>
              </Typography>
            </Column>
          </Box>
        </Column>
      </Dialog>
    </React.Fragment>
  );
};
