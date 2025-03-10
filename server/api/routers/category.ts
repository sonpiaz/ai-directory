import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { ADMIN_ROLE } from "../../constants";

export const categoryRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;
      return ctx.prisma.category.findUnique({
        where: { slug },
        include: {
          aiTools: {
            include: {
              categories: true,
            },
            take: 20,
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== ADMIN_ROLE) {
        throw new Error("Unauthorized: Only admins can create categories");
      }
      
      return ctx.prisma.category.create({
        data: input,
      });
    }),
}); 