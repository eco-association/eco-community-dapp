import { ethers } from "ethers";

const chainId = process.env.NEXT_PUBLIC_CHAIN === "goerli" ? 5 : 1;
const rpcURL = `https://${process.env.NEXT_PUBLIC_CHAIN}.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`;

const ethProvider = new ethers.providers.JsonRpcProvider(rpcURL, chainId);

export default ethProvider;
