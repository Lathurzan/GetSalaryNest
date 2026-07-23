export const toPence = (v: string | number) => Math.round(Number(v) * 100);
export const toDisplay = (pence: number) => (pence / 100).toFixed(2);

export const format = (pence: number, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency })
    .format(pence / 100);