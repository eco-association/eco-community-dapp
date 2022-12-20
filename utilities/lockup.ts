import { FundsLockup } from "../types";
import { SECONDS_PER_DAY } from "./formatDuration";
import { LockupFragmentResult } from "../queries/fragments/LockupFragment";
import { BigNumber, utils } from "ethers";
import { convertDate } from "./convertDate";
import { FundsLockupWithDeposit } from "../types/FundsLockup";
import moment from "moment";

function isLockupDeposit(
  lockup: FundsLockup | FundsLockupWithDeposit
): lockup is FundsLockupWithDeposit {
  return "reward" in lockup;
}

function wasLockupWithdrawnEarly(lockup: FundsLockupWithDeposit): boolean {
  return Boolean(
    lockup.withdrawnAt && lockup.endsAt.getTime() > lockup.withdrawnAt.getTime()
  );
}

export function getLockupDates(lockup: FundsLockup | FundsLockupWithDeposit) {
  const {
    depositWindowDuration: depositDuration,
    depositWindowEndsAt: endsAt,
    duration,
  } = lockup;

  const start = new Date(endsAt.getTime() - depositDuration);
  let end = new Date(endsAt.getTime() + duration);

  if (isLockupDeposit(lockup) && wasLockupWithdrawnEarly(lockup)) {
    end = lockup.withdrawnAt;
  }

  return { end, start };
}

export function getLockupAPY(lockup: FundsLockup): number {
  return (SECONDS_PER_DAY * 365 * lockup.interest) / lockup.duration;
}

export function formatLockup(
  generation: number,
  lockup?: LockupFragmentResult
): FundsLockup {
  if (!lockup) return;
  const duration = parseInt(lockup.duration) * 1000;
  return {
    duration,
    generation,
    address: lockup.id,
    interest: parseFloat(utils.formatUnits(lockup.interest, 7)),
    depositWindowEndsAt: convertDate(lockup.depositWindowEndsAt),
    depositWindowDuration: parseInt(lockup.depositWindowDuration) * 1000,
    endsAt: new Date(lockup.depositWindowEndsAt + duration),
  };
}

export function getLockupClaimAmount(
  lockup: FundsLockupWithDeposit,
  inflationMultiplier: BigNumber,
  early = false
) {
  const amount = lockup.amount.div(inflationMultiplier);
  return !early ? amount.add(lockup.reward) : amount.sub(lockup.reward);
}

export function isLockupClaimable(lockup: FundsLockupWithDeposit) {
  return Date.now() > lockup.endsAt.getTime() && !lockup.withdrawnAt;
}

export const lockupFormatDate = (date: Date) =>
  moment(date).format("MMM DD, YYYY");
