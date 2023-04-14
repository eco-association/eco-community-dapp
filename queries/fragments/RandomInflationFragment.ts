import { gql } from "@apollo/client";

export type RandomInflationFragmentResult = {
  address: string;
  blockNumber: string;
  reward: string;
  CLAIM_PERIOD: string;
  numRecipients: string;
  claimPeriodStarts: string;
  seedReveal: string | null;
  generation: { number: string };
};

export const RandomInflationFragment = gql`
  fragment RandomInflationFragment on RandomInflation {
    address: id
    blockNumber
    reward
    numRecipients
    CLAIM_PERIOD
    claimPeriodStarts
    seedReveal
    generation {
      number
    }
  }
`;
