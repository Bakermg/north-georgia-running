import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { db } from "~/server/db";
import { EventDataService } from "~/server/services/eventData";
import { validateRaceWebsite } from "~/server/services/websiteValidator";
import type { Event } from "~/types";

export const eventRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z
        .object({
          name: z.string().optional(),
          city: z.string().optional(),
          type: z.string().optional(),
          distance: z.string().optional(),
          dateFrom: z.date().optional(),
          dateTo: z.date().optional(),
          page: z.number().min(1).optional().default(1),
          limit: z.number().min(1).max(100).optional().default(12),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {
        OR: [
          { isApproved: true }, // Show approved manual submissions
          { source: "runsignup" }, // Show all RunSignUp events (auto-approved)
          { source: "atlanta_track_club" }, // Show Atlanta Track Club events
          { source: "active_com" }, // Show Active.com events
          { source: "ultrarunning" }, // Show UltraRunning.com events
          { source: "runningintheuasa" }, // Show RunningInTheUSA.com events
        ],
      };

      if (input?.name) {
        where.name = { contains: input.name };
      }

      if (input?.city) {
        where.city = { contains: input.city };
      }

      if (input?.type) {
        where.type = { contains: input.type };
      }

      if (input?.distance) {
        where.distance = { contains: input.distance };
      }

      // Default to showing only future events (from start of today) unless a specific date range is requested
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateFrom = input?.dateFrom ?? today;

      where.date = {
        gte: dateFrom,
      };

      if (input?.dateTo) {
        (where.date as Record<string, unknown>).lte = input.dateTo;
      }

      const page = input?.page ?? 1;
      const limit = input?.limit ?? 12;
      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
        db.event.findMany({
          where,
          orderBy: { date: "asc" },
          skip,
          take: limit,
        }),
        db.event.count({ where }),
      ]);

      // Check for user registration status if logged in
      let registeredEventIds = new Set<number>();
      if (ctx.session?.user) {
        const userEvents = await db.userEvent.findMany({
          where: {
            userId: ctx.session.user.id,
            eventId: { in: events.map((e) => e.id) },
          },
          select: { eventId: true },
        });
        registeredEventIds = new Set(userEvents.map((ue) => ue.eventId));
      }

      const eventsWithStatus = events.map((event) => ({
        ...event,
        isRegistered: registeredEventIds.has(event.id),
      }));

      return {
        events: eventsWithStatus,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getInfinite: publicProcedure
    .input(
      z.object({
        name: z.string().optional(),
        city: z.string().optional(),
        type: z.string().optional(),
        distance: z.string().optional(),
        dateFrom: z.date().optional(),
        dateTo: z.date().optional(),
        cursor: z.number().optional(),
        limit: z.number().min(1).max(50).optional().default(12),
      }),
    )
    .query(async ({ input }) => {
      const where: Record<string, unknown> = {
        OR: [
          { isApproved: true }, // Show approved manual submissions
          { source: "runsignup" }, // Show all RunSignUp events (auto-approved)
          { source: "atlanta_track_club" }, // Show Atlanta Track Club events
          { source: "active_com" }, // Show Active.com events
          { source: "ultrarunning" }, // Show UltraRunning.com events
          { source: "runningintheuasa" }, // Show RunningInTheUSA.com events
        ],
      };

      if (input?.name) {
        where.name = { contains: input.name };
      }

      if (input?.city) {
        where.city = { contains: input.city };
      }

      if (input?.type) {
        where.type = { contains: input.type };
      }

      if (input?.distance) {
        where.distance = { contains: input.distance };
      }

      // Default to showing only future events (from start of today) unless a specific date range is requested
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateFrom = input?.dateFrom ?? today;

      where.date = {
        gte: dateFrom,
      };

      if (input?.dateTo) {
        (where.date as Record<string, unknown>).lte = input.dateTo;
      }

      const limit = input.limit ?? 12;
      const cursor = input.cursor;

      const events = await db.event.findMany({
        where,
        orderBy: { date: "asc" },
        take: limit + 1, // Take one extra to check if there are more
        ...(cursor && {
          skip: 1, // Skip the cursor
          cursor: { id: cursor },
        }),
      });

      const hasNextPage = events.length > limit;
      const items = hasNextPage ? events.slice(0, -1) : events;
      const nextCursor = hasNextPage ? items[items.length - 1]?.id : null;

      return {
        items,
        nextCursor,
        hasNextPage,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const event = await db.event.findUnique({
        where: { id: input.id },
      });

      if (!event) {
        throw new Error("Event not found");
      }

      // Only show approved events to regular users
      // Allow: approved manual submissions OR all trusted source events
      const trustedSources = [
        "runsignup",
        "atlanta_track_club",
        "active_com",
        "ultrarunning",
        "runningintheuasa",
      ];
      if (!event.isApproved && !trustedSources.includes(event.source ?? "")) {
        throw new Error("This event is not yet available");
      }

      return event;
    }),

  importEvents: publicProcedure.mutation(async () => {
    const eventDataService = new EventDataService();
    const result = await eventDataService.importEventsToDatabase();
    return result;
  }),

  // Import events from all configured sources
  importAllEvents: publicProcedure.mutation(async () => {
    const eventDataService = new EventDataService();
    const result = await eventDataService.importAllEvents();
    return result;
  }),

  // Get event statistics by source
  getStats: publicProcedure.query(async () => {
    const eventDataService = new EventDataService();
    const stats = await eventDataService.getEventStats();
    return stats;
  }),

  submitEvent: publicProcedure
    .input(
      z.object({
        name: z.string().min(3, "Race name is required"),
        date: z.date(),
        location: z.string().min(3, "Race location is required"),
        city: z.string().min(2, "City is required"),
        state: z.string().default("GA"),
        type: z.string().min(2),
        distance: z.string().min(2, "Race distance is required"),
        websiteUrl: z.string().url("Valid website URL required"),
        organizerName: z.string().min(2, "Contact name is required"),
        organizerEmail: z.string().email("Valid email required"),
        organizerPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Check for potential duplicates by name, date, and city
        const existingEvent = await db.event.findFirst({
          where: {
            name: { contains: input.name },
            city: { contains: input.city },
            date: {
              gte: new Date(input.date.getTime() - 86400000), // 1 day before
              lte: new Date(input.date.getTime() + 86400000), // 1 day after
            },
          },
        });

        if (existingEvent) {
          throw new Error(
            "An event with this name in this city on/near this date already exists"
          );
        }

        // Create the event
        const event = await db.event.create({
          data: {
            name: input.name,
            date: input.date,
            location: input.location,
            city: input.city,
            state: input.state,
            type: input.type,
            distance: input.distance,
            websiteUrl: input.websiteUrl,
            source: "manual_submission",
            sourceId: `manual_${Date.now()}`,
            organizerName: input.organizerName,
            organizerEmail: input.organizerEmail,
            organizerPhone: input.organizerPhone ?? null,
            isApproved: false, // Admin must approve
          },
        });

        // Validate the website in the background (don't block submission)
        // Fire and forget - validation happens but doesn't delay user response
        void validateRaceWebsite(input.websiteUrl);

        return {
          success: true,
          message: "Event submitted successfully! Our team will review and approve it soon.",
          eventId: event.id,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to submit event"
        );
      }
    }),

  // Admin endpoints
  getPendingSubmissions: publicProcedure.query(async () => {
    const pendingEvents = await db.event.findMany({
      where: {
        isApproved: false,
        source: "manual_submission",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return pendingEvents;
  }),

  deleteSubmission: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const deletedEvent = await db.event.delete({
          where: { id: input.id },
        });

        return {
          success: true,
          message: `Event "${deletedEvent.name}" has been deleted.`,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to delete event"
        );
      }
    }),

  approveSubmission: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        const approvedEvent = await db.event.update({
          where: { id: input.id },
          data: { isApproved: true },
        });

        return {
          success: true,
          message: `Event "${approvedEvent.name}" has been approved and is now visible.`,
        };
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : "Failed to approve event"
        );
      }
    }),
});
