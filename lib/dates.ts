export const monthKey = (d: Date | string) => {
  const date = new Date(d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
};

export const monthRange = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return {
    start: new Date(y, m - 1, 1),
    end:   new Date(y, m, 0, 23, 59, 59, 999),
  };
};

export const monthLabel = (key: string) => {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1).toLocaleString("en-GB", { month: "long", year: "numeric" });
};