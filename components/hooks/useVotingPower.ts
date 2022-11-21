import { useAccount } from "wagmi";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import {
  VOTING_POWER,
  VotingPowerQueryResult,
  VotingPowerQueryVariables,
} from "../../queries/VOTING_POWER";
import { BigNumber } from "ethers";
import { Zero } from "@ethersproject/constants";
import { adjustVotingPower } from "../../utilities/adjustVotingPower";

function formatVotingPower(data?: VotingPowerQueryResult) {
  if (!data)
    return {
      ecoVotingPower: Zero,
      ecoXVotingPower: Zero,
      votingPower: Zero,
    };
  const ecoVotingPower = data.ECOVotingPower.length
    ? BigNumber.from(data.ECOVotingPower[0].value)
    : Zero;
  const secoxVotingPower = data.sECOXVotingPower.length
    ? BigNumber.from(data.sECOXVotingPower[0].value)
    : Zero;
  return {
    ecoVotingPower: ecoVotingPower.div(10),
    ecoXVotingPower: secoxVotingPower.div(10),
    votingPower: adjustVotingPower(
      ecoVotingPower.add(secoxVotingPower.mul(10))
    ),
  };
}

export const useVotingPower = (
  blockNumber: VotingPowerQueryVariables["blockNumber"] = Number.MAX_SAFE_INTEGER.toString()
) => {
  const account = useAccount();

  const [getVotingPower, { data, startPolling, stopPolling }] = useLazyQuery<
    VotingPowerQueryResult,
    VotingPowerQueryVariables
  >(VOTING_POWER);

  useEffect(() => {
    if (account.isConnected) {
      getVotingPower({
        variables: {
          blockNumber: blockNumber,
          address: account.address.toString().toLowerCase(),
        },
      });
    }
  }, [account.address, account.isConnected, blockNumber, getVotingPower]);

  useEffect(() => {
    startPolling(5_000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  return formatVotingPower(data);
};
