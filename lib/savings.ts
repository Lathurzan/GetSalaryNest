export function resolveTarget(
  mode: "percent" | "fixed",
  percentTarget: number,
  fixedTarget: number,
  monthlyIncome: number
): number {
  return mode === "percent"
    ? Math.round((monthlyIncome * percentTarget) / 100)
    : fixedTarget;
}