import React from "react";
import {
  Column,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import { displayAddress, tokensToNumber } from "../../../../utilities";
import { useVotingPowerSources } from "../../../../providers/VotingPowerSourcesProvider";
import { Zero } from "@ethersproject/constants";

const Container = styled(Column)({ width: "100%" });

interface SourcesProps {
  title: string;
  subtitle: string;
}

const Sources: React.FC<SourcesProps> = ({ title, subtitle }) => {
  return (
    <Row gap="md" justify="space-between">
      <Typography variant="body1">{title}</Typography>
      <Typography
        variant="body1"
        color="secondary"
        style={{ textAlign: "right" }}
      >
        {subtitle}
      </Typography>
    </Row>
  );
};

const VotingPowerSources: React.FC = () => {
  const { address } = useAccount();
  const sources = useVotingPowerSources();

  //TODO: Calculate voting power from lockups and wallets delegating to current wallet
  const lockupTotal = Zero;

  return (
    <Container gap="lg">
      <Typography variant="body3" color="secondary">
        SOURCES OF VOTING POWER
      </Typography>
      <Sources
        title={`${formatNumber(tokensToNumber(sources.eco), false)} ECO`}
        subtitle={`from your wallet ${displayAddress(address)}`}
      />
      <Sources
        title={`${formatNumber(
          tokensToNumber(sources.sEcoX),
          false
        )} staked ECOx`}
        subtitle={`from your wallet ${displayAddress(address)}`}
      />

      {!lockupTotal.isZero() ? (
        <Sources
          title={`${formatNumber(tokensToNumber(lockupTotal), false)} ECO`}
          subtitle="from lockups"
        />
      ) : null}

      {!sources.others.isZero() ? (
        <Sources
          title={`${formatNumber(
            tokensToNumber(sources.others),
            false
          )} voting power`}
          subtitle="from other wallets"
        />
      ) : null}

      {sources.isEcoDelegated ? (
        <Sources
          title={`-${formatNumber(tokensToNumber(sources.eco), false)} ECO`}
          subtitle="delegated to a wallet"
        />
      ) : null}
      {sources.isEcoXDelegated ? (
        <Sources
          title={`-${formatNumber(
            tokensToNumber(sources.sEcoX),
            false
          )} staked ECOx`}
          subtitle="delegated to a wallet"
        />
      ) : null}
    </Container>
  );
};

export default VotingPowerSources;
