const etherscanURL = (
  addr: string,
  type: "address" | "tx" | "token"
): string => {
  const explorer =
    process.env.NEXT_PUBLIC_CHAIN !== "mainnet"
      ? `${process.env.NEXT_PUBLIC_CHAIN}.etherscan.io`
      : "etherscan.io";

  switch (type) {
    case "address":
      return `https://${explorer}/address/${addr}`;
    case "tx":
      return `https://${explorer}/tx/${addr}`;
    case "token":
      return `https://${explorer}/token/${addr}`;
  }
};

export default etherscanURL;
