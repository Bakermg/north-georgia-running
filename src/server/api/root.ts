import { postRouter } from "~/server/api/routers/post";
import { eventRouter } from "~/server/api/routers/events";
import { userEventRouter } from "~/server/api/routers/userEvents";
import { raceFinderRouter } from "~/server/api/routers/raceFinder";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  events: eventRouter,
  userEvents: userEventRouter,
  raceFinder: raceFinderRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
