import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const quizRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        questions: z
          .array(
            z.object({ title: z.string().min(1), answer: z.string().min(1) }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quiz.create({
        data: {
          title: input.title,
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.quiz.findMany({ where: { isActive: true } }),
  ),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.quiz.findUnique({ where: { id: input.id } }),
    ),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        questions: z
          .array(
            z.object({ title: z.string().min(1), answer: z.string().min(1) }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quiz.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title ?? undefined,
        },
      });
      // TODO: update questions
    }),

  softDelete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quiz.update({
        where: { id: input.id },
        data: {
          isActive: false,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.quiz.delete({ where: { id: input.id } });
    }),
});
