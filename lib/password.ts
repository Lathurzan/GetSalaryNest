export type PasswordCheck = {
  length: boolean;
  upper: boolean;
  lower: boolean;
  number: boolean;
  special: boolean;
};

export function checkPassword(pw: string): PasswordCheck {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
  };
}

export function passwordScore(check: PasswordCheck): number {
  return Object.values(check).filter(Boolean).length; // 0–5
}

export function strengthLabel(score: number): { label: string; color: string } {
  if (score <= 1) return { label: "Weak", color: "#ef4444" };
  if (score === 2) return { label: "Fair", color: "#f59e0b" };
  if (score === 3 || score === 4) return { label: "Good", color: "#14b8a6" };
  return { label: "Strong", color: "#22c55e" };
}