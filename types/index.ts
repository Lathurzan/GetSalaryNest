export type Plan = "free" | "premium";
export type GoalMode = "percent" | "fixed";

export interface DashboardData {
  income: number;
  spent: number;
  saved: number;
  remaining: number;
  savingsGoal: {
    mode: GoalMode;
    target: number;
    saved: number;
    progress: number;
    label: string;
  };
  categories: {
    _id: string;
    name: string;
    icon: string;
    color: string;
    spent: number;
  }[];
  recent: {
    _id: string;
    amount: number;
    note?: string;
    date: string;
    category: { name: string; icon: string; color: string };
  }[];
}