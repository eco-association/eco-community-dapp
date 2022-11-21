import React from "react";
import {
  Column,
  formatNumber,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { useAccount } from "wagmi";
import moment from "moment";
import { displayAddress, tokensToNumber } from "../../../utilities";
import { useVotingPowerSources } from "../../hooks/useVotingPowerSources";

const Container = styled(Column)({ width: "100%" });

const VotingSources: React.FC = () => {
  const { address } = useAccount();
  const sources = useVotingPowerSources();

  return (
    <Container gap="lg">
      <Typography variant="body3" color="secondary">
        SOURCES OF YOUR VOTING POWER
      </Typography>
      <Row gap="md" justify="space-between">
        <Typography variant="body2">
          {formatNumber(tokensToNumber(sources.eco), false)} ECO
        </Typography>
        <Typography
          variant="body2"
          color="secondary"
          style={{ textAlign: "right" }}
        >
          from your wallet {displayAddress(address)}
        </Typography>
      </Row>
      <Row gap="md" justify="space-between">
        <Typography variant="body2">
          {formatNumber(tokensToNumber(sources.sEcoX), false)} sECOx
        </Typography>
        <Typography
          variant="body2"
          color="secondary"
          style={{ textAlign: "right" }}
        >
          from your wallet {displayAddress(address)}
        </Typography>
      </Row>
      {sources.fundsLockedUp.map((lockup) => (
        <Row key={lockup.id} gap="md" justify="space-between">
          <Typography variant="body2">
            {formatNumber(tokensToNumber(lockup.amount), false)} ECO
          </Typography>
          <Typography
            variant="body2"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            from Lockup ending {moment(lockup.endsAt).format("L")}
          </Typography>
        </Row>
      ))}
      {sources.ecoDelegatedToMe.map((delegate) => (
        <Row key={delegate.address} gap="md" justify="space-between">
          <Typography variant="body2">
            {formatNumber(tokensToNumber(delegate.amount), false)} ECO
          </Typography>
          <Typography
            variant="body2"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            delegated from wallet {displayAddress(delegate.address)}
          </Typography>
        </Row>
      ))}
      {sources.sEcoXDelegatedToMe.map((delegate) => (
        <Row key={delegate.address} gap="md" justify="space-between">
          <Typography variant="body2">
            {formatNumber(tokensToNumber(delegate.amount), false)} sECOx
          </Typography>
          <Typography
            variant="body2"
            color="secondary"
            style={{ textAlign: "right" }}
          >
            delegated from wallet {displayAddress(delegate.address)}
          </Typography>
        </Row>
      ))}
      {sources.fundsLockupDelegated.map((lockup) => (
        <Row key={lockup.id} gap="md" justify="space-between">
          <Typography variant="body2">
            {formatNumber(tokensToNumber(lockup.amount), false)} ECO
          </Typography>
          <Typography
            variant="body2"
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

export default VotingSources;
