# AGENTS.md

## Project Overview

North Georgia Running - A platform for discovering and managing running events in North Georgia. Built with the T3 Stack (Next.js, tRPC, Prisma, NextAuth).

## Commands

### Development
- **Dev**: `npm run dev` (Next.js with Turbo mode)
- **Build**: `npm run build`
- **Start**: `npm run start` (production server)
- **Preview**: `npm run preview` (build + start for testing)

### Code Quality
- **Lint**: `npm run lint` / `npm run lint:fix`
- **Type check**: `npm run typecheck` / `npm run check` (runs both lint and typecheck)
- **Format**: `npm run format:check` / `npm run format:write`

### Database
- **Studio**: `npm run db:studio` (Prisma Studio GUI)
- **Push**: `npm run db:push` (sync schema without migrations)
- **Migrate**: `npm run db:migrate` (apply migrations in production)
- **Generate**: `npm run db:generate` (create migration in development)
- **Postinstall**: Automatically runs `prisma generate` after npm install

### Tests
- No test framework configured yet

## Tech Stack

- **Framework**: Next.js 15 (App Router) with Turbo
- **API**: tRPC v11 (type-safe APIs)
- **Database**: Prisma ORM with SQLite
- **Auth**: NextAuth v5 (beta)
- **UI**: Material-UI (MUI) v7 + Tailwind CSS
- **State**: React Query (TanStack Query) v5
- **Validation**: Zod
- **Fonts**: Lato, Merriweather (via @fontsource)

## Code Style

### TypeScript
- **Strict mode**: Enabled with `noUncheckedIndexedAccess: true`
- **Imports**: Use inline type imports (`import type { X } from "..."`) - enforced by ESLint
- **Path aliases**: Use `~/` prefix for src imports (e.g., `~/trpc/server`, `~/server/api/routers/events`)
- **Module type**: ES modules (`"type": "module"`)

### Naming Conventions
- **Variables/Functions**: camelCase
- **Components**: PascalCase
- **Unused vars**: Prefix with `_` to ignore ESLint warnings

### React
- **Client components**: Use `"use client"` directive
- **Server components**: Default (no directive needed)
- **Error handling**: Use ErrorBoundary component

### tRPC
- **Public routes**: Use `publicProcedure` for unauthenticated endpoints
- **Validation**: Use Zod schemas for input validation
- **Routers**: Create in `~/server/api/routers/` and add to `appRouter` in `root.ts`

### Database
- **ORM**: Prisma with typed queries
- **Provider**: SQLite (development)
- **Models**: Event (main model), User, Post, Account, Session, VerificationToken

### Styling
- **Formatting**: Prettier with Tailwind CSS plugin
- **UI Components**: Material-UI (MUI) for complex components
- **Utility Classes**: Tailwind CSS for layout and styling
- **Theming**: Custom theme context + MUI theme provider

## Project Structure

- **API Routes**: `src/app/api/` (Next.js API routes)
- **tRPC Routers**: `src/server/api/routers/` (tRPC endpoints)
- **Components**: `src/app/_components/` (shared components)
- **Pages**: `src/app/` (Next.js App Router pages)
- **Services**: `src/server/services/` (business logic)
- **Styles**: `src/styles/` (global CSS and theme CSS)
- **Database**: `prisma/schema.prisma` (Prisma schema)
