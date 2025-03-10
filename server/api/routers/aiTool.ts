import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { ADMIN_ROLE } from "../../constants";

export const aiToolRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;

      const items = await ctx.prisma.aiTool.findMany({
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          categories: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getFiltered: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        categories: z.array(z.string()).optional(),
        pricingModels: z.array(z.string()).optional(),
        hasFreeVersion: z.boolean().optional(),
        platforms: z.array(z.string()).optional(),
        limit: z.number().min(1).max(100).optional().default(50),
        cursor: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { search, categories, pricingModels, hasFreeVersion, platforms, limit, cursor } = input;

      const where: any = {};

      if (search && search.trim() !== "") {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (categories && categories.length > 0) {
        where.categories = {
          some: {
            slug: { in: categories },
          },
        };
      }

      if (pricingModels && pricingModels.length > 0) {
        where.pricingModel = { in: pricingModels };
      }

      if (hasFreeVersion !== undefined) {
        where.hasFreeVersion = hasFreeVersion;
      }

      if (platforms && platforms.length > 0) {
        // Chúng ta lưu platforms dưới dạng JSON string, nên cần filter hơi khác
        where.OR = platforms.map(platform => ({
          platforms: { contains: platform }
        }));
      }

      const items = await ctx.prisma.aiTool.findMany({
        where,
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: [
          { featured: "desc" },
          { createdAt: "desc" },
        ],
        include: {
          categories: {
            select: { name: true, slug: true },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const { slug } = input;
      const tool = await ctx.prisma.aiTool.findUnique({
        where: { slug },
        include: {
          categories: true,
          useCases: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!tool) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Không tìm thấy công cụ với slug '${slug}'`,
        });
      }

      // Tăng số lượt xem
      await ctx.prisma.aiTool.update({
        where: { id: tool.id },
        data: { viewCount: { increment: 1 } },
      });

      return tool;
    }),

  getFeatured: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.aiTool.findMany({
      where: { featured: true },
      take: 6,
      include: {
        categories: true,
      },
      orderBy: { viewCount: "desc" },
    });
  }),

  searchByName: publicProcedure
    .input(z.object({ 
      query: z.string().min(1),
      limit: z.number().min(1).max(20).optional().default(5)
    }))
    .query(async ({ ctx, input }) => {
      const { query, limit } = input;
      return ctx.prisma.aiTool.findMany({
        where: {
          name: {
            contains: query,
          },
        },
        take: limit,
        orderBy: { viewCount: "desc" },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      });
    }),

  // Admin routes
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().min(1),
        longDesc: z.string().optional(),
        website: z.string().url().optional().nullable(),
        logo: z.string().url().optional().nullable(),
        pricingModel: z.string(),
        hasFreeVersion: z.boolean(),
        startingPrice: z.number().optional().nullable(),
        featured: z.boolean().optional(),
        categoryIds: z.array(z.string()),
        useCaseIds: z.array(z.string()).optional(),
        platforms: z.array(z.string()),
        integrations: z.array(z.string()).optional(),
        launchDate: z.date().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { categoryIds, useCaseIds, platforms, integrations, ...data } = input;
      
      // Kiểm tra xem người dùng có quyền admin không
      if (ctx.session.user.role !== ADMIN_ROLE) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Chỉ admin mới có thể tạo công cụ AI",
        });
      }

      return ctx.prisma.aiTool.create({
        data: {
          ...data,
          platforms: JSON.stringify(platforms),
          integrations: integrations ? JSON.stringify(integrations) : null,
          categories: {
            connect: categoryIds.map((id) => ({ id })),
          },
          useCases: useCaseIds
            ? {
                connect: useCaseIds.map((id) => ({ id })),
              }
            : undefined,
        },
      });
    }),
}); 