import React from "react";
import {
  Column,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import moment from "moment";
import { useAccount } from "wagmi";
import { displayAddress, tokensToNumber } from "../../../../utilities";
import { useVotingPowerSources } from "../../../hooks/useVotingPowerSources";
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

  const lockupTotal = sources.fundsLockedUp.reduce(
    (acc, lockup) => acc.add(lockup.amount),
    Zero
  );
  const totalDelegated = [sources.ecoDelegatedToMe, sources.sEcoXDelegatedToMe]
    .flatMap((token) => token.map((delegate) => delegate.amount))
    .reduce((acc, amount) => acc.add(amount), Zero);

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
        )} staked ECO`}
        subtitle={`from your wallet ${displayAddress(address)}`}
      />

      {!lockupTotal.isZero() ? (
        <Sources
          title={`${formatNumber(tokensToNumber(lockupTotal), false)} ECO`}
          subtitle="from lockups"
        />
      ) : null}

      {!totalDelegated.isZero() ? (
        <Sources
          title={`${formatNumber(
            tokensToNumber(totalDelegated),
            false
          )} voting power`}
          subtitle="from others"
        />
      ) : null}

      {sources.fundsLockedUp.map((lockup) => (
        <Row key={lockup.id} gap="md" justify="space-between">
          <Typography variant="body1">
            {formatNumber(tokensToNumber(lockup.amount), false)} ECO
          </Typography>
          <Typography
            variant="body1"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            from Lockup ending {moment(lockup.endsAt).format("L")}
          </Typography>
        </Row>
      ))}
      {sources.ecoDelegatedToMe.map((delegate) => (
        <Row key={delegate.address} gap="md" justify="space-between">
          <Typography variant="body1">
            {formatNumber(tokensToNumber(delegate.amount), false)} ECO
          </Typography>
          <Typography
            variant="body1"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            delegated from wallet {displayAddress(delegate.address)}
          </Typography>
        </Row>
      ))}
      {sources.sEcoXDelegatedToMe.map((delegate) => (
        <Row key={delegate.address} gap="md" justify="space-between">
          <Typography variant="body1">
            {formatNumber(tokensToNumber(delegate.amount), false)} staked ECOx
          </Typography>
          <Typography
            variant="body1"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            delegated from wallet {displayAddress(delegate.address)}
          </Typography>
        </Row>
      ))}
      {sources.fundsLockupDelegated.map((lockup) => (
        <Row key={lockup.id} gap="md" justify="space-between">
          <Typography variant="body1">
            {formatNumber(tokensToNumber(lockup.amount), false)} ECO
          </Typography>
          <Typography
            variant="body1"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            delegated from Vault ending {moment(lockup.endsAt).format("L")}
          </Typography>
        </Row>
      ))}
    </Container>
  );
};

export default VotingPowerSources;
