import type { NextAuthOptions, Session } from "next-auth";
import type { Account, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }): Promise<Session> {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
    async signIn({
      user,
      account,
    }: {
      user: NextAuthUser;
      account: Account | null;
    }): Promise<boolean> {
      if (account?.provider === "google") {
        const email = user.email ?? "";
        const profile = user.image ?? "";

        if (!email) {
          return false;
        }

        const userDb = await prisma.user.findFirst({
          where: { email },
        });

        if (!userDb) {
          const defaultUsername = email.split("@")[0];
          await prisma.user.create({
            data: {
              email,
              username: defaultUsername,
              profilePicture: profile,
              provider: "Google",
            },
          });
        }
      }
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
