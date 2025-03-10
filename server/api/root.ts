import { createTRPCRouter } from "./trpc";
import { aiToolRouter } from "./routers/aiTool";
import { categoryRouter } from "./routers/category";
import { useCaseRouter } from "./routers/useCase";

/**
 * Router chính, bao gồm các router con
 */
export const appRouter = createTRPCRouter({
  aiTool: aiToolRouter,
  category: categoryRouter,
  useCase: useCaseRouter,
});

// Định nghĩa kiểu dữ liệu cho client
export type AppRouter = typeof appRouter; 