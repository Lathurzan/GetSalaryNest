import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      plan: "free" | "premium";
      currency: string;
      isPremium: boolean;
    };
  }

  interface User {
    id: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan?: "free" | "premium";
    currency?: string;
    isPremium?: boolean;
  }
}