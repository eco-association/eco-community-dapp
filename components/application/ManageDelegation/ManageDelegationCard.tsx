import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Column,
  formatNumber,
  Row,
  Typography,
} from "@ecoinc/ecomponents";
import { displayAddress, tokensToNumber } from "../../../utilities";
import { useCommunity } from "../../../providers";
import ManageDelegationModal from "./ManageDelegationModal/ManageDelegationModal";
import { useVotingPower } from "../../hooks/useVotingPower";
import { ManageDelegationProvider } from "./ManageDelegationModal/provider/ManageDelegationProvider";
import { useAccount } from "wagmi";
import { useVotingPowerSources } from "../../hooks/useVotingPowerSources";
import { BigNumber } from "ethers";

interface SourcesProps {
  amount: BigNumber;
  sourceType: VotingSourceType;
}

enum VotingSourceType {
  ECO = "ECO",
  SECOX = "sECOx",
  LOCKUPS = "From Lockups",
  OTHERS = "Delegated from others",
}

const Sources: React.FC<SourcesProps> = ({ amount, sourceType }) => {
  const account = useAccount();
  return (
    <Row gap="xl" style={{ justifyContent: "space-between" }}>
      <Typography variant="body1">
        {formatNumber(tokensToNumber(amount))}{" "}
        {sourceType !== VotingSourceType.OTHERS &&
          sourceType !== VotingSourceType.LOCKUPS &&
          sourceType}
      </Typography>
      <Typography variant="body1" color="secondary">
        {sourceType === VotingSourceType.ECO ||
        sourceType === VotingSourceType.SECOX
          ? `From your wallet ${displayAddress(account.address)}`
          : sourceType}
      </Typography>
    </Row>
  );
};

const ManageDelegationCard = () => {
  const votingSources = useVotingPowerSources();
  const community = useCommunity();
  const account = useAccount();
  const { votingPower } = useVotingPower();
  const { votingPower: currentGenVotingPower } = useVotingPower(
    community.currentGeneration.blockNumber
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [totalDelegatedToMe, setTotalDelegatedToMe] = useState<BigNumber>();
  const [totalLockedUp, setTotalLockedUp] = useState<BigNumber>();

  useMemo(() => {
    const totalDelegated = BigNumber.from("0");
    const totalLockups = BigNumber.from("0");
    votingSources.ecoDelegatedToMe.map((e) => {
      totalDelegated.add(e.amount);
    });
    votingSources.sEcoXDelegatedToMe.map((e) => {
      totalDelegated.add(e.amount);
    });
    votingSources.fundsLockedUp.map((e) => {
      totalLockups.add(e.amount);
    });
    setTotalDelegatedToMe(totalDelegated);
    setTotalLockedUp(totalLockups);
  }, [votingSources]);

  return (
    <Card>
      <ManageDelegationProvider>
        <ManageDelegationModal
          key={account.address}
          open={modalOpen}
          votingPower={votingPower}
          currentGenVotingPower={currentGenVotingPower}
          onRequestClose={() => setModalOpen(false)}
        />
      </ManageDelegationProvider>
      <Column gap="lg">
        <Typography variant="h4">
          {formatNumber(tokensToNumber(votingPower))} Voting power
        </Typography>
        <hr />
        <Typography variant="subtitle1" color="secondary">
          SOURCES OF VOTING POWER
        </Typography>
        <Sources amount={votingSources.eco} sourceType={VotingSourceType.ECO} />
        <Sources
          amount={votingSources.sEcoX}
          sourceType={VotingSourceType.SECOX}
        />
        {totalDelegatedToMe?.gt(BigNumber.from("0")) && (
          <Sources
            amount={totalDelegatedToMe}
            sourceType={VotingSourceType.OTHERS}
          />
        )}
        {totalLockedUp?.gt(BigNumber.from("0")) && (
          <Sources
            amount={totalLockedUp}
            sourceType={VotingSourceType.LOCKUPS}
          />
        )}
        <Row gap="md">
          <Typography variant="body2" color="secondary" css={{ width: "60%" }}>
            manage delegating your votes to others, or become a delegate
            yourself.
          </Typography>
          <Button
            variant="outline"
            color="secondary"
            onClick={() => setModalOpen(true)}
            style={{ width: 169, height: 38, padding: 0 }}
          >
            Manage Delegation
          </Button>
        </Row>
      </Column>
    </Card>
  );
};

export default ManageDelegationCard;
