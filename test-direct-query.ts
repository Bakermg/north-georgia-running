import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDirectQuery() {
  try {
    console.log("Testing direct database query...");
    const events = await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
    console.log(`Found ${events.length} events`);
    console.log("First event:", events[0]);
  } catch (error) {
    console.error("Database query error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectQuery();
