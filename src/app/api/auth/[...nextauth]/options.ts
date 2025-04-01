// auth.ts
import type { NextAuthOptions, Session, User } from "next-auth";
import type { Account, Profile } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import { JWT } from "next-auth/jwt";

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
    async jwt({ token, user, account }: { 
      token: JWT;
      user?: User;
      account?: Account | null;
      profile?: Profile;
    }) {
      // Initial sign-in: get user from DB and add ID to token
      if (user && account?.provider) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (dbUser) {
          token.sub = dbUser.id; // Set JWT sub to database ID
          token.email = dbUser.email ?? undefined;
        }
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        // Add database ID to session
        session.user.id = token.sub!;
        session.user.email = token.email!;
      }
      return session;
    },

    async signIn({ user, account, profile }: { 
      user: User;
      account: Account | null;
      profile?: Profile;
    }) {
      try {
        if (account?.provider === "google") {
          if (!user.email) throw new Error("No email provided");

          // Upsert user in database
          const dbUser = await prisma.user.upsert({
            where: { email: user.email },
            update: {
              profilePicture: user.image || profile?.image,
            },
            create: {
              email: user.email,
              username: user.email.split("@")[0],
              profilePicture: user.image || profile?.image,
              provider: "Google",
            },
          });

          // Attach database ID to user object
          user.id = dbUser.id;
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// next-auth.d.ts
// import { DefaultSession } from "next-auth";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       email: string;
//     } & DefaultSession["user"];
//   }

//   interface User {
//     id?: string;
//   }
// }

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
  }
}