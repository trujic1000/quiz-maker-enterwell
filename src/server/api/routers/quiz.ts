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
          questions: {
            create: input.questions?.map((question) => ({
              title: question.title,
              answer: question.answer,
            })),
          },
        },
      });
    }),

  getAll: publicProcedure.query(({ ctx }) =>
    ctx.db.quiz.findMany({
      where: { isActive: true },
      include: {
        questions: true,
      },
    }),
  ),

  getById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.db.quiz.findUnique({
        where: { id: input.id },
        include: { questions: true },
      }),
    ),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        questions: z.array(
          z.object({
            id: z.string().optional(),
            title: z.string().min(1),
            answer: z.string().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db.$transaction(async (prisma) => {
        if (input.title) {
          await prisma.quiz.update({
            where: { id: input.id },
            data: { title: input.title },
          });
        }

        // Delete existing questions for the quiz
        await prisma.question.deleteMany({
          where: { quizId: input.id },
        });

        // Recreate questions based on the input
        const questionsCreation =
          input.questions.map((question) => {
            return prisma.question.create({
              data: {
                title: question.title,
                answer: question.answer,
                quizId: input.id,
              },
            });
          }) || [];

        // Execute question creation in parallel
        await Promise.all(questionsCreation);

        // Return the updated quiz
        return prisma.quiz.findUnique({
          where: { id: input.id },
          include: { questions: true },
        });
      });

      return transaction;
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

  getQuestions: publicProcedure.query(({ ctx }) =>
    ctx.db.question.findMany({ distinct: "title" }),
  ),
});
