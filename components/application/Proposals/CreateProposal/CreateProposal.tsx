import React, { useState } from "react";
import { css } from "@emotion/react";
import Image from "next/image";
import {
  Button,
  Card,
  Column,
  formatNumber,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import DeployProposalModal, { ProposalAction } from "./DeployProposalModal";
import CodeMirror from "./CodeMirror";
import sampleProposal from "../../../../assets/sampleProposal";
import { useConnectContext } from "../../../../providers/ConnectModalProvider";
import { useAccount } from "wagmi";
import { useCommunity, useWallet } from "../../../../providers";
import { GenerationStage } from "../../../../types";
import EcoLogo from "../../../../public/images/eco-logo/eco-logo-grey.svg";
import { WeiPerEther } from "@ethersproject/constants";
import { tokensToNumber } from "../../../../utilities";

const deployBox = css({
  backgroundColor: "#f6f9fb",
  padding: "12px 16px",
  borderRadius: "8px",
});

const card = css({
  height: "fit-content",
  border: "1px solid #f1f7fa",
  padding: "24px 8px",
});

const WhiteBox = styled.div({
  padding: 8,
  background: "white",
});

const SubmitButton = styled(Button)({
  padding: "10px 18px",
});

const Content = styled(Column)({
  width: "95%",
  maxWidth: 1177,
  paddingBottom: 24,
  margin: "0 auto",
});

const SUBMISSION_FEE = WeiPerEther.mul(10000); // 1.000 ECO
const SUBMISSION_FEE_FORMATTED = formatNumber(
  tokensToNumber(SUBMISSION_FEE),
  false
);

const CreateProposal: React.FC = () => {
  const { preventUnauthenticatedActions } = useConnectContext();
  const community = useCommunity();
  const wallet = useWallet();
  const { isConnected } = useAccount();

  const [code, setCode] = useState(sampleProposal);
  const [action, setAction] = useState(ProposalAction.None);

  const handleDeployAndSubmit = () => {
    if (!isConnected) return preventUnauthenticatedActions();
    setAction(ProposalAction.DeployAndSubmit);
  };

  const handleSubmit = () => {
    if (!isConnected) return preventUnauthenticatedActions();
    setAction(ProposalAction.Submit);
  };

  const isSubmitPhase = community.stage.name === GenerationStage.Submit;
  const hasEnoughEco = wallet.ecoBalance.gte(SUBMISSION_FEE);

  const buttonDisabled = !isSubmitPhase || !hasEnoughEco;

  return (
    <Content gap="xl">
      <DeployProposalModal
        action={action}
        code={code}
        onRequestClose={() => setAction(ProposalAction.None)}
      />
      <Grid columns="388px auto" gap="44px" alignItems="start">
        <Column gap="lg" style={{ position: "sticky", top: 64 }}>
          <Card css={card}>
            <Column gap="xl">
              <Column gap="xl" style={{ padding: "0 8px" }}>
                <Column gap="md">
                  <Typography
                    variant="h3"
                    color="primary"
                    style={{ lineHeight: 1 }}
                  >
                    About submitting proposals
                  </Typography>
                  <Row>
                    <Image
                      alt="eco logo"
                      src={EcoLogo}
                      height={11}
                      width={11}
                    />
                    <Typography variant="body3" color="secondary">
                      {" "}
                      {SUBMISSION_FEE_FORMATTED} ECO submission fee
                    </Typography>
                  </Row>
                </Column>
                <Column gap="lg">
                  <Typography variant="body2" color="secondary">
                    Every proposal needs the following:
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    i)<b> Name</b>: This will title your proposal.
                    <br />
                    We recommend descriptive ones that are short like,
                    &quot;Decrease Submission Fees for Governance
                    Proposals&quot;.
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    ii)<b> Description</b>: This is your chance to make the case
                    for your proposal. Why is it important? Why should people
                    vote for it? Add a few sentences, or more!
                  </Typography>
                  <Typography variant="body2" color="secondary">
                    iii)<b> Link to a forum post</b>: This should be the URL for
                    the discussion in the community around the proposal you’re
                    submitting.
                  </Typography>
                </Column>
              </Column>
              <Grid
                gap="24px"
                columns="auto 156px"
                alignItems="center"
                css={deployBox}
              >
                <Column>
                  {!isSubmitPhase ? (
                    <Typography variant="body2" color="secondary">
                      Proposal window is not open right now
                    </Typography>
                  ) : hasEnoughEco ? (
                    <Typography variant="body3">
                      Ready? You won&apos;t be able to edit it after you deploy.
                    </Typography>
                  ) : (
                    <Typography variant="body3" color="error">
                      Not enough ECO
                    </Typography>
                  )}
                </Column>
                <SubmitButton
                  color="success"
                  disabled={buttonDisabled}
                  onClick={handleDeployAndSubmit}
                >
                  Deploy & Submit
                </SubmitButton>
              </Grid>
            </Column>
          </Card>
          {!buttonDisabled ? (
            <Typography variant="body2" color="secondary">
              Already deployed?{" "}
              <Typography
                link
                variant="body2"
                color="info"
                onClick={handleSubmit}
                style={{ textDecoration: "underline" }}
              >
                Submit address
              </Typography>
            </Typography>
          ) : null}
        </Column>
        <Column gap="xl">
          <Card css={card} style={{ padding: "24px 16px" }}>
            <Column gap="lg">
              <Typography
                variant="h3"
                color="primary"
                style={{ lineHeight: 1 }}
              >
                On-chain Proposal Submission
              </Typography>
              <Typography variant="body2" color="secondary">
                Submitting a proposal to the Eco community governance system
                requires writing Solidity code that implements the proposed
                actions. If that&apos;s not something you&apos;re comfortable
                with, you should go to the{" "}
                <a
                  href="https://forums.eco.org/c/egp/11"
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: "underline" }}
                >
                  Governance Discourse forum
                </a>{" "}
                where proposals can be posted in text and discussed, and then
                others can help implement them if they receive broad support.
                Even if you are comfortable with Solidity, you should likely
                post your proposal on Discourse first to evaluate the
                community&apos;s support for it. <br />
                <br />
                <b>
                  If your proposal is not selected, 50% of your submission fee
                  will be refunded to you.
                </b>
              </Typography>
            </Column>
          </Card>
          <WhiteBox>
            <CodeMirror value={code} setValue={setCode} />
          </WhiteBox>
        </Column>
      </Grid>
    </Content>
  );
};

export default CreateProposal;
