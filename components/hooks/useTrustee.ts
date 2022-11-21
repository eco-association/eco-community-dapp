import { useLazyQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import { TRUSTEE, TrusteeQueryResult } from "../../queries/TRUSTEE";
import { useEffect } from "react";

export interface TrusteeData {
  votingRecord: BigNumber;
  fullyVestedRewards: BigNumber;
  lastYearVotingRecord: BigNumber;
}

export const useTrustee = (address: string) => {
  const [getTrustee, { data: original, ...opts }] =
    useLazyQuery<TrusteeQueryResult>(TRUSTEE, {
      fetchPolicy: "no-cache",
    });

  useEffect(() => {
    if (address) {
      getTrustee({ variables: { id: address.toLowerCase() } });
    }
  }, [address, getTrustee]);

  const data: TrusteeData = original?.trustee
    ? {
        votingRecord: BigNumber.from(original.trustee.votingRecord),
        fullyVestedRewards: BigNumber.from(original.trustee.fullyVestedRewards),
        lastYearVotingRecord: BigNumber.from(
          original.trustee.lastYearVotingRecord
        ),
      }
    : undefined;

  return { data, ...opts };
};
