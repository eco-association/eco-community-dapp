export const NumberFormatter = new Intl.NumberFormat("en-EN", {
  maximumFractionDigits: 2,
});

export const numberFormatter = (amount: number) =>
  NumberFormatter.format(amount);
