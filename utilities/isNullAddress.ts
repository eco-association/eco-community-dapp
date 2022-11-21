import { Address } from "../types";

const isNullAddress = (address: string | Address | null) => {
    if (!address) {
      return true;
    } else if (typeof address === "string") {
      return address === "0x0000000000000000000000000000000000000000";
    } else {
      return address.toString() === "0x0000000000000000000000000000000000000000";
    }
};

export default isNullAddress;
