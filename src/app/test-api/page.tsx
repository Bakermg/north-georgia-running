"use client";

import { api } from "~/trpc/react";

export default function TestPage() {
  const { data, error, isLoading } = api.events.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>API Test</h1>
      <p>Found {data?.events?.length ?? 0} events</p>
      <pre>{JSON.stringify(data?.events?.slice(0, 2), null, 2)}</pre>
    </div>
  );
}
