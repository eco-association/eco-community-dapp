import { BigNumber, ethers } from "ethers";
import { RandomInflationRecipient, RandomInflationWithClaims } from "../types";
import { RandomInflation } from "../types/RandomInflation";
import { convertDate } from "./convertDate";
import { RandomInflationFragmentResult } from "../queries/fragments/RandomInflationFragment";

type MerkleTreeLeaf = {
  account: string;
  balance: BigNumber;
  sum: BigNumber;
  index: number;
  hash: string;
};

type MerkleTree =
  | MerkleTreeLeaf
  | {
      hash: string;
      left: MerkleTree;
      right: MerkleTree;
    };

/*
 * Takes an array of sorted items and recursively builds a merkle tree
 */
function arrayToTree(
  items: [string, BigNumber, BigNumber][],
  min: number,
  max: number,
  maxFilled: number
): MerkleTree {
  let index;
  let sum;
  if (min > maxFilled) {
    return {
      index: 0,
      sum: ethers.constants.Zero,
      balance: ethers.constants.Zero,
      account: ethers.constants.AddressZero,
      hash: "0x0000000000000000000000000000000000000000000000000000000000000000",
    };
  }
  if (min === max) {
    if (items[min][0] === ethers.constants.AddressZero) {
      index = 0;
      sum = 0;
    } else {
      index = min;
      sum = items[min][2];
    }
    return {
      account: items[min][0],
      balance: items[min][1],
      sum,
      index,
      hash: ethers.utils.solidityKeccak256(
        ["bytes20", "uint256", "uint256", "uint256"],
        [items[min][0], items[min][1], items[min][2], index]
      ),
    };
  }

  const spread = Math.floor((max - min) / 2);
  const a = arrayToTree(items, min, min + spread, maxFilled);
  const b = arrayToTree(items, max - spread, max, maxFilled);
  const params = [a.hash, b.hash];
  return {
    left: a,
    right: b,
    hash: ethers.utils.solidityKeccak256(
      ["bytes32", "bytes32"],
      [params[0], params[1]]
    ),
  };
}

/*
 * Takes a map of accounts and balances and returns a merkle tree of it
 */
function getTree(map: [string, BigNumber][]) {
  const len = map.length;
  const wantitems = 2 ** Math.ceil(Math.log2(len));
  let sum = BigNumber.from(0);

  const items = [...map]
    .sort((a, b) => Number(a[0].localeCompare(b[0], "en")))
    .map((item) => {
      const _item: [string, BigNumber, BigNumber] = [item[0], item[1], sum];
      sum = sum.add(item[1]);
      return _item;
    });

  const tree = arrayToTree(items, 0, wantitems - 1, items.length - 1);
  return { tree, len, total: sum };
}

function answer(
  tree: MerkleTree,
  len: number,
  index: number
): [MerkleTreeLeaf, string[]] {
  const r = [];
  const bits = Math.ceil(Math.log2(len));

  let node: any = tree;
  for (let b = bits - 1; b >= 0; b -= 1) {
    const right = (index & (1 << b)) !== 0;
    if (right) {
      r.push(node.left.hash);
      node = node.right;
    } else {
      r.push(node.right.hash);
      node = node.left;
    }
  }

  return [node, r];
}

function getRecipient(
  balanceSums: BigNumber[],
  addresses: string[],
  claimNumber: BigNumber
) {
  if (claimNumber.isZero()) {
    return { index: 0, address: addresses[0] };
  }
  let index = balanceSums.findIndex((element) => element.gt(claimNumber));
  index = index === -1 ? addresses.length - 1 : index - 1;
  return { index, address: addresses[index] };
}

function getClaimParameters(
  seed: string,
  tree: MerkleTree,
  treeLen: number,
  sequence: number,
  totalSum: BigNumber,
  balanceSums: BigNumber[],
  addresses: string[]
) {
  const chosenClaimNumberHash = ethers.utils.solidityKeccak256(
    ["bytes32", "uint256"],
    [seed, sequence]
  );
  const claimNumber = BigNumber.from(chosenClaimNumberHash).mod(
    BigNumber.from(totalSum)
  );
  const { index, address: recipient } = getRecipient(
    balanceSums,
    addresses,
    claimNumber
  );
  return { answer: answer(tree, treeLen, index), index, recipient };
}

function fromBalances(balancesMap: Record<string, BigNumber>) {
  const arrayOfMap = [];
  const balanceSums = [];
  let totalSum = ethers.constants.Zero;
  const addresses = Object.keys(balancesMap).sort();

  for (const a of addresses) {
    balanceSums.push(totalSum);
    totalSum = totalSum.add(balancesMap[a]);
    arrayOfMap.push([a, balancesMap[a]]);
  }

  const tree = getTree(arrayOfMap);
  return { ...tree, addresses, balanceSums, totalSum };
}

function getSequenceClaimTime(
  sequence: number,
  randomInflation: RandomInflation
) {
  const {
    numRecipients: num,
    claimPeriodDuration,
    claimPeriodStarts,
  } = randomInflation;
  if (!num) return claimPeriodStarts;
  const time =
    claimPeriodStarts.getTime() + (sequence * claimPeriodDuration) / num;
  return new Date(time);
}

export function getRandomInflationRecipients(
  randomInflation: RandomInflationWithClaims,
  accounts: { address: string; balance: BigNumber }[]
) {
  const balancesMap: Record<string, BigNumber> = {};

  for (let i = 0; i < accounts.length; ++i) {
    const account = accounts[i];
    balancesMap[account.address] = account.balance;
  }

  const {
    tree,
    len: treeLen,
    addresses,
    balanceSums,
    totalSum,
  } = fromBalances(balancesMap);

  const recipients: RandomInflationRecipient[] = [];
  const numRecipients = randomInflation.numRecipients;

  for (let seqNo = 0; seqNo < numRecipients; seqNo++) {
    const { answer, index, recipient } = getClaimParameters(
      randomInflation.seedReveal,
      tree,
      treeLen,
      seqNo,
      totalSum,
      balanceSums,
      addresses
    );
    const proof = answer[1].reverse();
    const leafSum = answer[0].sum;

    const claimed = !!randomInflation.claims.find(
      (claim) => claim.sequenceNumber === seqNo
    );

    const claimableAt = getSequenceClaimTime(seqNo, randomInflation);
    recipients.push({
      index,
      proof,
      leafSum,
      claimed,
      recipient,
      claimableAt,
      randomInflation,
      sequenceNumber: seqNo,
    });
  }

  return { recipients, tree };
}

export function formatRandomInflation(
  randomInflation: RandomInflationFragmentResult
): RandomInflation {
  return {
    address: randomInflation.address,
    reward: BigNumber.from(randomInflation.reward),
    blockNumber: parseInt(randomInflation.blockNumber),
    numRecipients: parseInt(randomInflation.numRecipients),
    claimPeriodStarts: convertDate(randomInflation.claimPeriodStarts),
    claimPeriodDuration: parseInt(randomInflation.CLAIM_PERIOD) * 1000,
    seedReveal: randomInflation.seedReveal,
  };
}
