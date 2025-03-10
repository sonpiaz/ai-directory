import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import { prisma } from "../../../server/db";

// Định nghĩa các role constants
export const USER_ROLE = "USER";
export const ADMIN_ROLE = "ADMIN";

/**
 * Mở rộng loại User trong session của next-auth
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

/**
 * Cấu hình NextAuth
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        role: user.role,
      },
    }),
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Đơn giản hóa xác thực để demo
        if (credentials?.email === "admin@example.com") {
          return {
            id: "admin-id",
            email: "admin@example.com",
            name: "Admin User",
            role: ADMIN_ROLE,
          };
        }

        if (credentials?.email === "user@example.com") {
          return {
            id: "user-id",
            email: "user@example.com",
            name: "Regular User",
            role: USER_ROLE,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "my-secret",
};

/**
 * Helper để lấy session từ server-side
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

// Thêm export default để NextAuth hoạt động
export default NextAuth(authOptions); 