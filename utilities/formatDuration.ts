export const SECONDS_PER_MINUTE = 60 * 1000;
export const SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
export const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
export const SECONDS_PER_MONTH = 30 * SECONDS_PER_DAY;

enum Unit {
  MONTH = "month",
  DAY = "day",
  HOUR = "hour",
  MINUTE = "minute",
  SECOND = "second",
}

export function formatDuration(time: number) {
  const getAmount = (time: number, range: number, _unit: Unit) => {
    const amount = Math.floor(time / range);
    const unit = amount === 1 ? _unit : _unit + "s";
    return { amount, unit };
  };
  if (time > SECONDS_PER_MONTH)
    return getAmount(time, SECONDS_PER_MONTH, Unit.MONTH);
  if (time > SECONDS_PER_DAY) return getAmount(time, SECONDS_PER_DAY, Unit.DAY);
  if (time > SECONDS_PER_HOUR)
    return getAmount(time, SECONDS_PER_HOUR, Unit.HOUR);
  if (time > SECONDS_PER_MINUTE)
    return getAmount(time, SECONDS_PER_MINUTE, Unit.MINUTE);
  return getAmount(time, 1000, Unit.SECOND);
}
