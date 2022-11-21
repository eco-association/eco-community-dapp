const CurrencyFormatter = new Intl.NumberFormat("en-EN", {
  currency: "USD",
  maximumFractionDigits: 2,
});

export const currencyFormatter = (amount: number) =>
  CurrencyFormatter.format(amount);
