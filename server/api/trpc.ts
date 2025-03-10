import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { getServerSession } from "next-auth/next";

import { prisma } from "../db";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

/**
 * Tạo context cho tRPC
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;
  const session = await getServerSession(req, res, authOptions);

  return {
    prisma,
    session,
  };
};

/**
 * Khởi tạo tRPC API
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * tRPC router và procedure helpers
 */
export const createTRPCRouter = t.router;
export const router = t.router;
export const publicProcedure = t.procedure;

/**
 * Middleware xác thực
 */
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      ...ctx,
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(isAuthed); 