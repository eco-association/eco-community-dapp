import React, {
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { ApolloClient, useApolloClient, useQuery } from "@apollo/client";
import { RANDOM_INFLATION, RandomInflationQueryResult } from "../queries";
import { RandomInflationRecipient, RandomInflationWithClaims } from "../types";
import { BigNumber } from "ethers";
import { SubgraphRandomInflation } from "../queries/RANDOM_INFLATION";
import { RandomInflationClaim } from "../types/RandomInflation";
import {
  ECO_SNAPSHOT,
  EcoSnapshotQueryResult,
  EcoSnapshotQueryVariables,
} from "../queries/ECO_SNAPSHOT";
import {
  formatRandomInflation,
  getRandomInflationRecipients,
} from "../utilities/randomInflationTools";
import { useAccount } from "wagmi";
import { Zero } from "@ethersproject/constants";
import { RandomInflationModal } from "../components/application/Account/EcoCard/RandomInflationModal";

export enum RandomInflationActionType {
  SetState,
  Claim,
}

export type RandomInflationAction =
  | {
      type: RandomInflationActionType.SetState;
      state: RandomInflationWithClaims[];
    }
  | {
      type: RandomInflationActionType.Claim;
      randomInflationId: string;
      recipient: string;
      sequence: number;
    };

const randomInflationReducer: React.Reducer<
  RandomInflationWithClaims[],
  RandomInflationAction
> = (state, action) => {
  switch (action.type) {
    case RandomInflationActionType.SetState:
      return action.state;
    case RandomInflationActionType.Claim:
      return state.map((ri) => {
        if (ri.address !== action.randomInflationId) return ri;
        return {
          ...ri,
          claims: [
            ...ri.claims,
            { claimedFor: action.recipient, sequenceNumber: action.sequence },
          ],
        };
      });
  }
};

function parseAccountsSnapshot(
  accountsSnapshotQuery?: EcoSnapshotQueryResult
): { address: string; balance: BigNumber }[] {
  if (!accountsSnapshotQuery) return [];

  return accountsSnapshotQuery.accounts
    .map((account) => {
      if (!account.ECOVotingPowers.length) return;
      const balance = BigNumber.from(account.ECOVotingPowers[0].value);
      return { address: account.address, balance };
    })
    .filter((account) => !!account && !account.balance.isZero())
    .sort((a, b) => {
      return a.address
        .toLowerCase()
        .localeCompare(b.address.toLowerCase(), "en");
    });
}

async function getRecipients(
  client: ApolloClient<object>,
  randomInflation: RandomInflationWithClaims
): Promise<RandomInflationRecipient[]> {
  if (!randomInflation.seedReveal) return [];
  try {
    const queryResult = await client.query<
      EcoSnapshotQueryResult,
      EcoSnapshotQueryVariables
    >({
      query: ECO_SNAPSHOT,
      variables: { blockNumber: randomInflation.blockNumber },
    });

    const accounts = parseAccountsSnapshot(queryResult.data);
    const { recipients, tree } = getRandomInflationRecipients(
      randomInflation,
      accounts
    );

    if (randomInflation.acceptedRootHash !== tree.hash) {
      console.warn(
        "[Random Inflation Issue]: Tree from balances don't match accepted root hash",
        randomInflation.address
      );
      return [];
    }

    return recipients;
  } catch (err) {
    console.error(
      "Error getting recipients for random inflation",
      randomInflation.address,
      err
    );
    return [];
  }
}

function formatRandomInflationWithClaims(
  randomInflation: SubgraphRandomInflation
): RandomInflationWithClaims {
  const { inflationRootHashProposal } = randomInflation;

  const claims = randomInflation.claims.map(
    (claim): RandomInflationClaim => ({
      sequenceNumber: parseInt(claim.sequenceNumber),
      claimedFor: claim.account.address,
    })
  );
  const ri = formatRandomInflation(randomInflation);
  const now = Date.now();

  return {
    ...ri,
    claims, // sequence numbers claimed
    recipients: [],
    acceptedRootHash: inflationRootHashProposal.acceptedRootHash,
    inflationRootHashAccepted: inflationRootHashProposal.accepted,
    isClaimPeriod:
      inflationRootHashProposal.acceptedRootHash &&
      now >= ri.claimPeriodStarts.getTime() &&
      claims.length !== ri.numRecipients,
  };
}

function parseRandomInflationQuery(
  queryResult: RandomInflationQueryResult
): RandomInflationWithClaims[] {
  if (!queryResult) return [];
  return queryResult.randomInflations.map(formatRandomInflationWithClaims);
}

function getReceiptID(receipt: RandomInflationRecipient): string {
  return `${receipt.randomInflation.address}-${receipt.sequenceNumber}`;
}

function isClaimable(
  recipient: RandomInflationRecipient,
  address: string
): boolean {
  return (
    !recipient.claimed &&
    recipient.recipient === address &&
    Date.now() > recipient.claimableAt.getTime()
  );
}

const getClaimId = (recipient: string, sequence: number) =>
  `${recipient}-${sequence}`;

interface RandomInflationState {
  isModalOpen: boolean;
  setModalOpen(open: boolean): void;
  claimableAmount: BigNumber;
  actives: RandomInflationRecipient[];
  pendingClaims: RandomInflationRecipient[];
  randomInflations: RandomInflationWithClaims[];
  claimableRandomInflations: RandomInflationWithClaims[];
  dispatch: React.Dispatch<RandomInflationAction>;
}

const RandomInflationContext = React.createContext<RandomInflationState>({
  isModalOpen: false,
  actives: [],
  pendingClaims: [],
  randomInflations: [],
  claimableRandomInflations: [],
  claimableAmount: Zero,
  dispatch: () => ({}),
  setModalOpen: () => ({}),
});

export const RandomInflationProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const account = useAccount();
  const apolloClient = useApolloClient();
  const [randomInflations, dispatch] = useReducer(randomInflationReducer, []);

  const address = account.address?.toLowerCase();

  const [isModalOpen, setModalOpen] = useState(false);
  const [recipients, setRecipients] = useState<
    Record<string, RandomInflationRecipient[]>
  >({});

  const {
    data: randomInflationQuery,
    called,
    loading,
  } = useQuery<RandomInflationQueryResult>(RANDOM_INFLATION);

  useEffect(() => {
    dispatch({
      type: RandomInflationActionType.SetState,
      state: parseRandomInflationQuery(randomInflationQuery),
    });
  }, [randomInflationQuery]);

  useEffect(() => {
    const get = async () => {
      const requests = randomInflations
        .filter((ri) => ri.isClaimPeriod)
        .map(async (ri) => {
          const result = await getRecipients(apolloClient, ri);
          return [ri.address, result];
        });
      const pairs = await Promise.all(requests);
      setRecipients(Object.fromEntries(pairs));
    };
    get();
  }, [apolloClient, randomInflations]);

  const items = useMemo(
    () =>
      randomInflations.map((ri): RandomInflationWithClaims => {
        const claimIds = ri.claims.map((claim) =>
          getClaimId(claim.claimedFor, claim.sequenceNumber)
        );
        const riRecipients = (recipients[ri.address] || []).map((r) => ({
          ...r,
          claimed: claimIds.includes(getClaimId(r.recipient, r.sequenceNumber)),
        }));
        return { ...ri, recipients: riRecipients };
      }),
    [randomInflations, recipients]
  );

  const [availableClaims, setAvailableClaims] = useState<string[]>([]);
  const [randomInflationIDs, setRandomInflationIds] = useState<string[]>([]);

  const claimableRandomInflations = useMemo(
    () => items.filter((ri) => randomInflationIDs.includes(ri.address)),
    [randomInflationIDs, items]
  );

  const pendingClaims = claimableRandomInflations
    .flatMap((ri) => ri.recipients)
    .filter((r) => isClaimable(r, address));

  const activeRecipients = claimableRandomInflations
    .flatMap((ri) => ri.recipients)
    .filter((r) => availableClaims.includes(getReceiptID(r)));

  const claimableAmount = pendingClaims.reduce(
    (acc, reward) => acc.add(reward.randomInflation.reward),
    Zero
  );

  useEffect(() => {
    if (called && !loading) {
      const ids = items
        .filter((ri) => ri.recipients.some((r) => isClaimable(r, address)))
        .map((ri) => ri.address);
      setRandomInflationIds(ids);
    }
  }, [address, called, loading, items]);

  useEffect(() => {
    if (!availableClaims.length) {
      const recipientIDs = claimableRandomInflations
        .flatMap((ri) => ri.recipients)
        .filter((r) => isClaimable(r, address))
        .map(getReceiptID);
      setAvailableClaims(recipientIDs);
    }
  }, [address, availableClaims.length, claimableRandomInflations]);

  return (
    <RandomInflationContext.Provider
      value={{
        dispatch,
        isModalOpen,
        setModalOpen,
        pendingClaims,
        claimableAmount,
        claimableRandomInflations,
        actives: activeRecipients,
        randomInflations: items,
      }}
    >
      <RandomInflationModal />
      {children}
    </RandomInflationContext.Provider>
  );
};

export const useRandomInflation = () => useContext(RandomInflationContext);
