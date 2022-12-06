import { TopBar } from "../commons/TopBar";
import { BigNumber } from "ethers";
import {
  Button,
  Column,
  Dialog,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import React, { useEffect, useState } from "react";
import { useGasFee } from "../../hooks/useGasFee";
import { useAccount } from "wagmi";
import { useRandomInflation } from "../../hooks/useRandomInflation";
import { useRandomInflation as useRandomInflationContract } from "../../hooks/contract/useRandomInflation";
import * as randomInflationTools from "../../../utilities/randomInflationTools";
import { RandomInflation, RandomInflationRecipient } from "../../../types";
import {
  ECO_SNAPSHOT,
  EcoSnapshotQueryResult,
  EcoSnapshotQueryVariables,
} from "../../../queries/ECO_SNAPSHOT";
import { useLazyQuery } from "@apollo/client";
import { displayAddress, txError } from "../../../utilities";

const Box = styled(Column)(({ theme }) => ({
  padding: "16px 24px",
  backgroundColor: theme.palette.disabled.bg,
}));
const Content = styled(Column)({ padding: "0 24px" });

const REFUND_GAS_LIMIT = 149_038;

const parseAccountsSnapshot = (
  accountsSnapshotQuery?: EcoSnapshotQueryResult
): { address: string; balance: BigNumber }[] => {
  if (!accountsSnapshotQuery) return [];

  return accountsSnapshotQuery.accounts
    .map((account) => {
      if (!account.ECOVotingPowers.length) return;
      const balance = BigNumber.from(account.ECOVotingPowers[0].value);
      return { address: account.address, balance };
    })
    .filter((account) => !!account && !account.balance.isZero())
    .sort((a, b) => {
      return a.address
        .toLowerCase()
        .localeCompare(b.address.toLowerCase(), "en");
    });
};

const getRecipients = (
  randomInflation: RandomInflation,
  accountsSnapshotQuery?: EcoSnapshotQueryResult
) => {
  const accounts = parseAccountsSnapshot(accountsSnapshotQuery);

  const balancesMap: Record<string, BigNumber> = {};

  for (let i = 0; i < accounts.length; ++i) {
    const account = accounts[i];
    balancesMap[account.address] = account.balance;
  }

  const {
    tree,
    len: treeLen,
    addresses,
    balanceSums,
    totalSum,
  } = randomInflationTools.fromBalances(balancesMap);

  console.log({
    tree,
    balancesMap,
    totalSum,
    addresses,
    balanceSums,
  });

  const numRecipients = randomInflation.numRecipients.toNumber();

  const rec: RandomInflationRecipient[] = [];

  for (let seqNo = 0; seqNo < numRecipients; seqNo++) {
    const { answer, index, recipient } =
      randomInflationTools.getClaimParameters(
        randomInflation.seedReveal,
        tree,
        treeLen,
        seqNo,
        totalSum,
        balanceSums,
        addresses
      );
    const proof = answer[1].reverse();
    const leafSum = answer[0].sum;

    const claimed = !!randomInflation.claims.find(
      (claim) => claim.sequenceNumber === seqNo
    );

    rec.push({
      index,
      proof,
      leafSum,
      claimed,
      recipient,
      sequenceNumber: seqNo,
    });
  }

  return rec;
};

export const RandomInflationNotification = () => {
  const account = useAccount();
  const randomInflation = useRandomInflation();

  const [recipient, setRecipient] = useState<RandomInflationRecipient>();

  const contract = useRandomInflationContract(randomInflation?.address);

  const [getEcoSnapshot, { data }] = useLazyQuery<
    EcoSnapshotQueryResult,
    EcoSnapshotQueryVariables
  >(ECO_SNAPSHOT);

  const gasFee = useGasFee(REFUND_GAS_LIMIT);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (randomInflation) {
      getEcoSnapshot({
        variables: { blockNumber: randomInflation.blockNumber },
      });
    }
  }, [getEcoSnapshot, randomInflation]);

  useEffect(() => {
    if (randomInflation && data) {
      const recipients = getRecipients(randomInflation, data);
      console.log({ recipients });
      const recip = recipients.find(
        (r) => r.recipient === account.address.toLowerCase()
      );
      if (recip) setRecipient(recip);
    }
  }, [account.address, data, randomInflation]);

  if (!recipient) return null;

  const claim = async () => {
    setLoading(true);
    try {
      console.log([
        recipient.recipient,
        recipient.sequenceNumber,
        recipient.proof,
        recipient.leafSum,
        recipient.index,
      ]);
      const claimTx = await contract.claimFor(
        recipient.recipient,
        recipient.sequenceNumber,
        recipient.proof,
        recipient.leafSum,
        recipient.index
        // { gasLimit: 2_500_000 }
      );
      claimTx.wait();
    } catch (err) {
      txError("Failed claiming random inflation", err);
    }
    setLoading(false);
  };

  return (
    <React.Fragment>
      <TopBar gap="sm" onClick={() => setOpen(true)}>
        You have a random inflation to claim.
      </TopBar>
      <Dialog
        isOpen={open}
        shouldCloseOnEsc={!loading}
        shouldShowCloseButton={!loading}
        shouldCloseOnOverlayClick={!loading}
        onRequestClose={() => setOpen(false)}
      >
        <Column gap="xl">
          <Content gap="lg">
            <Typography variant="h2">Claim random inflation</Typography>
            <Typography variant="body1">Claim random inflation</Typography>
          </Content>
          <Box gap="lg">
            <Row gap="sm">
              <Typography variant="body1">Move to your wallet </Typography>
              <Typography variant="body1" color="secondary">
                Eth Address {displayAddress(account.address)}
              </Typography>
            </Row>
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
