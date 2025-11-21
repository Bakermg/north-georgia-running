import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";

export const userEventRouter = createTRPCRouter({
  toggle: protectedProcedure
    .input(z.object({ eventId: z.number(), status: z.string().default("REGISTERED") }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const existing = await db.userEvent.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId: input.eventId,
          },
        },
      });

      if (existing) {
        await db.userEvent.delete({
          where: { id: existing.id },
        });
        return { status: "removed" };
      } else {
        await db.userEvent.create({
          data: {
            userId,
            eventId: input.eventId,
            status: input.status,
          },
        });
        return { status: "added" };
      }
    }),

  getMyEvents: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return db.userEvent.findMany({
      where: { userId },
      include: {
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
