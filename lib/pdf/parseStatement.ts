export interface ParsedRow {
  date: string;        // ISO
  description: string;
  amount: number;      // pence, positive = money out
  raw: string;
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

// "12 Aug 2026   TESCO STORES   -42.50"
const PATTERN_A =
  /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(.{3,60}?)\s+[-–]?£?\s?(\d{1,3}(?:,\d{3})*\.\d{2})/;

// "12/08/2026  TESCO STORES  42.50"
const PATTERN_B =
  /(\d{2})\/(\d{2})\/(\d{4})\s+(.{3,60}?)\s+£?\s?(\d{1,3}(?:,\d{3})*\.\d{2})/;

const toPence = (s: string) => Math.round(parseFloat(s.replace(/,/g, "")) * 100);

const clean = (s: string) =>
  s.trim().replace(/\s{2,}/g, " ").replace(/\s+\d{4,}$/, "").slice(0, 60);

export function parseStatement(text: string, fallbackYear?: number): ParsedRow[] {
  const rows: ParsedRow[] = [];
  const seen = new Set<string>();

  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.length < 12) continue;

    // skip obvious non-transaction lines
    if (/balance|statement|page \d|opening|closing|total|sort code|account no/i.test(trimmed)) {
      continue;
    }

    let date: Date | null = null;
    let description = "";
    let pence = 0;

    const a = trimmed.match(PATTERN_A);
    const b = !a ? trimmed.match(PATTERN_B) : null;

    if (a) {
      const month = MONTHS[a[2].toLowerCase()];
      if (month === undefined) continue;
      date = new Date(Number(a[3]), month, Number(a[1]));
      description = clean(a[4]);
      pence = toPence(a[5]);
    } else if (b) {
      date = new Date(Number(b[3]), Number(b[2]) - 1, Number(b[1]));
      description = clean(b[4]);
      pence = toPence(b[5]);
    } else {
      continue;
    }

    if (isNaN(date.getTime()) || !pence || pence > 100_000_00) continue;

    const key = `${date.toISOString().slice(0, 10)}|${description}|${pence}`;
    if (seen.has(key)) continue;
    seen.add(key);

    rows.push({
      date: date.toISOString(),
      description,
      amount: pence,
      raw: trimmed,
    });
  }

  return rows;
}

// naive merchant → category name guesser
const HINTS: Record<string, string[]> = {
  Groceries: ["tesco", "sainsbury", "aldi", "lidl", "asda", "morrisons", "waitrose", "co-op"],
  "Eating Out": ["mcdonald", "kfc", "nando", "pizza", "greggs", "starbucks", "costa", "deliveroo", "uber eats", "just eat"],
  Transport: ["uber", "tfl", "trainline", "shell", "bp ", "esso", "national rail"],
  Utilities: ["british gas", "edf", "octopus", "thames water", "council tax", "virgin media", "sky ", "bt "],
  "Home Rent": ["rent", "landlord", "letting"],
  Shopping: ["amazon", "argos", "primark", "h&m", "zara", "next retail"],
  Health: ["boots", "pharmacy", "nhs", "bupa"],
};

export function guessCategory(description: string): string | null {
  const d = description.toLowerCase();
  for (const [category, keys] of Object.entries(HINTS)) {
    if (keys.some((k) => d.includes(k))) return category;
  }
  return null;
}