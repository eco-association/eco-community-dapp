import { gql } from "@apollo/client";

export type LockupFragmentResult = {
  id: string;
  duration: string;
  interest: string;
  totalLocked: string;
  depositWindowDuration: string;
  depositWindowEndsAt: string;
};

export const LockupFragment = gql`
  fragment LockupFragment on FundsLockup {
    id
    depositWindowDuration
    depositWindowEndsAt
    duration
    interest
    totalLocked
  }
`;
