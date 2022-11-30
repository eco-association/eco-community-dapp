import { BigNumber } from "ethers";
import { FundsLockupWithDeposit } from "./FundsLockup";

export interface WalletInterface {
  ecoBalance: BigNumber;
  ecoXBalance: BigNumber;
  sEcoXBalance: BigNumber;
  wEcoBalance: BigNumber;
  ecoTotalSupply: BigNumber;
  ecoXTotalSupply: BigNumber;
  sEcoXTotalSupply: BigNumber;
  wEcoTotalSupply: BigNumber;
  inflationMultiplier: BigNumber;
  ECODelegator: string | null;
  sECOxDelegator: string | null;

  lockups: FundsLockupWithDeposit[];
}
