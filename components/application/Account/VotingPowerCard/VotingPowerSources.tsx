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

      {sources.lockupsDelegatedToMe.map((lockup) => (
        <Sources
          key={lockup.address}
          title={`${formatNumber(tokensToNumber(lockup.amount), false)} ECO`}
          subtitle={`from lockup ${displayAddress(lockup.address)}`}
        />
      ))}

      {sources.ecoDelegatedToMe.map((delegation) => (
        <Sources
          key={delegation.address}
          title={`${formatNumber(
            tokensToNumber(delegation.amount),
            false
          )} ECO`}
          subtitle={`delegated from ${displayAddress(delegation.address)}`}
        />
      ))}
      {sources.stakedEcoXDelegatedToMe.map((delegation) => (
        <Sources
          key={delegation.address}
          title={`${formatNumber(
            tokensToNumber(delegation.amount),
            false
          )} staked ECOx`}
          subtitle={`delegated from ${displayAddress(delegation.address)}`}
        />
      ))}

      {sources.ecoDelegated.map((delegation) => (
        <Sources
          key={delegation.address}
          title={`-${formatNumber(
            tokensToNumber(delegation.amount),
            false
          )} ECO`}
          subtitle={`delegated to ${displayAddress(delegation.address)}`}
        />
      ))}
      {sources.stakedEcoXDelegated.map((delegation) => (
        <Sources
          key={delegation.address}
          title={`-${formatNumber(
            tokensToNumber(delegation.amount),
            false
          )} staked ECOx`}
          subtitle={`delegated to ${displayAddress(delegation.address)}`}
        />
      ))}
    </Container>
  );
};

export default VotingPowerSources;
