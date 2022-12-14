import { ethers } from "ethers";
import web3 from "web3";
import BN from "bn.js";

const { toBN } = web3.utils;

function fromBalances(balancesMap) {
  const arrayOfMap = [];
  const orderedBalanceSums = [];
  let totalSum = toBN("0");
  let orderedAddresses = Object.keys(balancesMap).sort();
  for (const a of orderedAddresses) {
    orderedBalanceSums.push(totalSum);
    const bal = toBN(balancesMap[a]);
    totalSum = totalSum.add(bal);
    arrayOfMap.push([a, bal]);
  }

  const tree = getTree(arrayOfMap);
  return [tree, orderedAddresses, orderedBalanceSums, totalSum];
}

function arrayToTree(items, min, max) {
  let index;
  let sum;
  if (min === max) {
    if (items[min][0] === 0) {
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
      hash: web3.utils.soliditySha3(
        {
          t: "bytes20",
          v: items[min][0].toString(),
        },
        {
          t: "uint256",
          v: items[min][1],
        },
        {
          t: "uint256",
          v: items[min][2],
        },
        {
          t: "uint256",
          v: index,
        }
      ),
    };
  }
  const spread = Math.floor((max - min) / 2);
  const a = arrayToTree(items, min, min + spread);
  const b = arrayToTree(items, max - spread, max);
  const params = [a.hash, b.hash];
  return {
    left: a,
    right: b,
    hash: web3.utils.soliditySha3(
      {
        t: "bytes32",
        v: params[0],
      },
      {
        t: "bytes32",
        v: params[1],
      }
    ),
  };
}

function getTree(map, wrongSum = [], swapIndex = []) {
  const items = [...map];

  items.sort((a, b) => Number(a[0] - b[0]));
  if (swapIndex.length > 0) {
    const b = items[swapIndex[0]];
    items[swapIndex[0]] = items[swapIndex[1]];
    items[swapIndex[1]] = b;
  }

  const len = items.length;

  const wantitems = 2 ** Math.ceil(Math.log2(len));
  for (let i = len; i < wantitems; i += 1) {
    items.push([0, 0]);
  }
  let sum = new web3.utils.BN(0);
  for (let i = 0; i < len; i += 1) {
    if (wrongSum.length > 0) {
      if (i === wrongSum[0]) {
        sum = web3.utils.toBN(wrongSum[1]);
      }
    }

    items[i].push(sum);
    sum = sum.add(items[i][1]);
  }
  for (let i = len; i < wantitems; i += 1) {
    items[i].push(0);
  }
  const r = arrayToTree(items, 0, items.length - 1);
  r.items = len;
  r.total = sum;
  return r;
}

function answer(tree, index) {
  const r = [];
  const bits = Math.ceil(Math.log2(tree.items));

  let node = tree;
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

function getRecipient(orderedBalanceSums, orderedAddresses, claimNumber) {
  if (new BN(claimNumber) === 0) {
    return [0, accounts[0]];
  }
  let index = orderedBalanceSums.findIndex((element) =>
    element.gt(new BN(claimNumber))
  );
  index = index === -1 ? 2 : index - 1;
  return [index, orderedAddresses[index]];
}

function getClaimParameters(
  seed,
  tree,
  sequence,
  totalSum,
  orderedBalanceSums,
  orderedAddresses
) {
  const chosenClaimNumberHash = ethers.utils.solidityKeccak256(
    ["bytes32", "uint256"],
    [seed, sequence]
  );
  const [index, recipient] = getRecipient(
    orderedBalanceSums,
    orderedAddresses,
    new BN(chosenClaimNumberHash.slice(2), 16).mod(new BN(totalSum))
  );
  return [answer(tree, index), index, recipient];
}

export default {
  fromBalances,
  getTree,
  arrayToTree,
  getClaimParameters,
  getRecipient,
  answer,
};
