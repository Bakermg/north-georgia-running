import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { RaceSearchService } from "~/server/services/raceSearchService";
import { db } from "~/server/db";

export const raceFinderRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(3, "Search query must be at least 3 characters"),
      })
    )
    .query(async ({ input }) => {
      const service = new RaceSearchService();
      const results = await service.searchRaces(input.query);
      return results;
    }),

  fetchRaceDetails: publicProcedure
    .input(
      z.object({
        url: z.string().url("Must be a valid URL"),
      })
    )
    .query(async ({ input }) => {
      const service = new RaceSearchService();
      const details = await service.fetchRaceDetails(input.url);
      return details;
    }),

  checkDuplicate: publicProcedure
    .input(
      z.object({
        name: z.string(),
        date: z.date().optional(),
        city: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const where: Record<string, unknown> = {
        name: { contains: input.name },
      };

      if (input.city) {
        where.city = { contains: input.city };
      }

      if (input.date) {
        where.date = {
          gte: new Date(input.date.getTime() - 86400000), // 1 day before
          lte: new Date(input.date.getTime() + 86400000), // 1 day after
        };
      }

      const existingEvent = await db.event.findFirst({
        where,
        select: {
          id: true,
          name: true,
          date: true,
          city: true,
        },
      });

      return {
        isDuplicate: !!existingEvent,
        existingEvent,
      };
    }),
});
