import { useQuery } from "react-query";
import { ContractCallContext, Multicall } from "ethereum-multicall";
import { ECO__factory, ECOxStaking__factory } from "../../types/contracts";
import { useContractAddresses } from "../../providers";
import { useAccount, useProvider } from "wagmi";
import { useDelegationState } from "../application/Account/VotingPowerCard/ManageDelegationModal/provider/ManageDelegationProvider";
import { AddressZero } from "@ethersproject/constants";

function getPayload(
  address: string,
  eco: string,
  sECOx: string
): ContractCallContext[] {
  return [
    {
      reference: "eco",
      contractAddress: eco,
      abi: [...ECO__factory.abi],
      calls: [
        {
          reference: "ecoEnabled",
          methodName: "delegationToAddressEnabled",
          methodParameters: [address],
        },
        {
          reference: "ECODelegator",
          methodName: "getPrimaryDelegate",
          methodParameters: [address],
        },
      ],
    },
    {
      reference: "secox",
      contractAddress: sECOx,
      abi: [...ECOxStaking__factory.abi],
      calls: [
        {
          reference: "sEcoXEnabled",
          methodName: "delegationToAddressEnabled",
          methodParameters: [address],
        },
        {
          reference: "sECOxDelegator",
          methodName: "getPrimaryDelegate",
          methodParameters: [address],
        },
      ],
    },
  ];
}

export const useDelegates = () => {
  const account = useAccount();
  const provider = useProvider();
  const { state } = useDelegationState();
  const { eco, sEcoX } = useContractAddresses();

  return useQuery(
    "token-delegates",
    async () => {
      const multicall = new Multicall({
        ethersProvider: provider,
        tryAggregate: true,
      });
      const payload = getPayload(account.address, eco, sEcoX);

      const { results } = await multicall.call(payload);

      const [ecoEnabled, ECODelegator] = results.eco.callsReturnContext.flatMap(
        (r) => r.returnValues
      );
      const [sEcoXEnabled, sECOxDelegator] =
        results.secox.callsReturnContext.flatMap((r) => r.returnValues);

      return { ecoEnabled, ECODelegator, sEcoXEnabled, sECOxDelegator };
    },
    {
      enabled:
        account.isConnected &&
        !state.secox.loading &&
        !state.eco.loading &&
        !state.secox.loadingDelegation &&
        !state.eco.loadingDelegation &&
        eco !== AddressZero &&
        sEcoX !== AddressZero,
    }
  );
};
