/**
 * Script to import events from all sources
 * Run with: npx tsx scripts/import-events.ts
 */

import { EventDataService } from "../src/server/services/eventData";

async function main() {
  console.log("🚀 Starting event import from all sources...\n");
  
  const eventDataService = new EventDataService();
  
  try {
    const result = await eventDataService.importAllEvents();
    
    console.log("\n✅ Import Complete!\n");
    console.log("📊 Results:");
    console.log("─────────────────────────────────────");
    console.log(`RunSignUp:           ${result.runsignup.imported} imported, ${result.runsignup.duplicates} duplicates`);
    console.log(`Atlanta Track Club:  ${result.atc.imported} imported, ${result.atc.duplicates} duplicates`);
    console.log(`Active.com:          ${result.active.imported} imported, ${result.active.duplicates} duplicates`);
    console.log("─────────────────────────────────────");
    console.log(`TOTAL:               ${result.total.imported} new events, ${result.total.duplicates} duplicates`);
    console.log("\n");
    
    // Get and display stats
    const stats = await eventDataService.getEventStats();
    console.log("📈 Database Statistics:");
    console.log("─────────────────────────────────────");
    console.log(`Total Events:        ${stats.total}`);
    console.log(`Upcoming Events:     ${stats.upcoming}`);
    console.log("\nBy Source:");
    Object.entries(stats.bySource).forEach(([source, count]) => {
      console.log(`  ${source.padEnd(20)} ${count}`);
    });
    console.log("\nTop Event Types:");
    Object.entries(stats.byType)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([type, count]) => {
        console.log(`  ${type.padEnd(20)} ${count}`);
      });
    
  } catch (error) {
    console.error("❌ Import failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log("\n✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
