import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { RANDOM_INFLATION, RandomInflationQueryResult } from "../../queries";
import {
  Address,
  RandomInflation as RandomInflationType,
  RandomInflationClaim,
} from "../../types";
import { BigNumber } from "ethers";

export const useRandomInflation = () => {
  const {
    data: randomInflationQuery,
    startPolling,
    stopPolling,
  } = useQuery<RandomInflationQueryResult>(RANDOM_INFLATION);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return parseRandomInflationQuery(randomInflationQuery);
};

function parseRandomInflationQuery(
  queryResult: RandomInflationQueryResult
): RandomInflationType | null {
  if (
    !queryResult ||
    !queryResult.generations.length ||
    !queryResult.generations[0].randomInflation
  ) {
    return null;
  }

  const { randomInflation } = queryResult.generations[0];
  const claims = randomInflation.claims.map(
    (claim): RandomInflationClaim => ({
      sequenceNumber: parseInt(claim.sequenceNumber),
      claimedFor: new Address(claim.account.address),
    })
  );

  return {
    address: new Address(randomInflation.address),
    numRecipients: BigNumber.from(randomInflation.numRecipients),
    reward: BigNumber.from(randomInflation.reward),
    claimPeriodStarts: BigNumber.from(randomInflation.claimPeriodStarts),
    claimPeriodDuration: BigNumber.from(randomInflation.CLAIM_PERIOD),
    claims, // sequence numbers claimed
    seedCommit:
      randomInflation.seedCommit && BigNumber.from(randomInflation.seedCommit),
    seedReveal: randomInflation.seedReveal,
    blockNumber: BigNumber.from(randomInflation.blockNumber),
    acceptedRootHash:
      randomInflation.inflationRootHashProposal.acceptedRootHash,
    inflationRootHashAccepted:
      randomInflation.inflationRootHashProposal.accepted,
  };
}
