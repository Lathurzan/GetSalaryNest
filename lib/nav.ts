import {
  LayoutDashboard, Receipt, PieChart, Settings, Upload,
} from "lucide-react";

export const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/expenses",  label: "Expenses",  icon: Receipt },
  { href: "/reports",   label: "Reports",   icon: PieChart },
  { href: "/settings",  label: "Settings",  icon: Settings },
] as const;

export const SECONDARY = [
  { href: "/import", label: "Import statement", icon: Upload },
] as const;