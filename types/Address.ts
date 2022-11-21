import { BigNumber } from "ethers";

export class Address {
  private readonly address: string;

  constructor(address: string) {
    this.address = address;
  }

  eq(address: string | Address | null) {
    if (!address) {
      return null;
    } else if (typeof address === "string") {
      return this.toString().toLowerCase() === address.toLowerCase();
    } else {
      return this.toString().toLowerCase() === address.toString().toLowerCase();
    }
  }

  isZero() {
    return BigNumber.from(this.toString()).isZero();
  }

  toString = () => {
    return this.address;
  };
}
