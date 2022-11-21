import { BigNumber } from "ethers";
import { Approval } from "./";

export interface WalletInterface {
  ecoBalance: BigNumber;
  ecoXBalance: BigNumber;
  sEcoXBalance: BigNumber;
  wEcoBalance: BigNumber;
  ecoTotalSupply: BigNumber;
  ecoXTotalSupply: BigNumber;
  sEcoXTotalSupply: BigNumber;
  wEcoTotalSupply: BigNumber;
  ECODelegator: string | null;
  sECOxDelegator: string | null;
  ecoApprovals: Approval[];
}
