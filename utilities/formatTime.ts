import moment from "moment";

export const formatTime = (date: Date): string => {
  // format: aug 2, 5:04pm

  const m = moment(date);
  const text = m.format("D, hh:mma");
  const month = m.format("MMM").toLowerCase();

  return `${month} ${text}`;
};
