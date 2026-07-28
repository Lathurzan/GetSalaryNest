import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Category from "@/models/Category";
import { DEFAULT_CATEGORIES } from "@/lib/seed";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).select("+passwordHash");

        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      await dbConnect();
      let dbUser = await User.findOne({ email: user.email!.toLowerCase() });

      if (!dbUser) {
        dbUser = await User.create({
          email: user.email!.toLowerCase(),
          name: user.name,
          image: user.image,
          emailVerified: true,      // Google already verified ownership
          provider: "google",
        });
        await Category.insertMany(
          DEFAULT_CATEGORIES.map((c) => ({ ...c, userId: dbUser!._id, isDefault: true }))
        );
      } else if (!dbUser.emailVerified) {
        // existing account signing in via Google → trust Google's verification
        dbUser.emailVerified = true;
        await dbUser.save();
      }

      user.id = dbUser._id.toString();
      return true;
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;

      if (token.id) {
        await dbConnect();
        const u = await User.findById(token.id).select("plan currency planExpiresAt emailVerified");
        if (u) {
          token.plan = u.plan;
          token.currency = u.currency;
          token.emailVerified = u.emailVerified;
          token.isPremium =
            u.plan === "premium" &&
            (!u.planExpiresAt || u.planExpiresAt > new Date());
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.plan = token.plan as "free" | "premium";
        session.user.currency = token.currency as string;
        session.user.isPremium = token.isPremium as boolean;
        (session.user as any).emailVerified = token.emailVerified as boolean;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};