import { db } from "~/server/db";
import { RaceSearchService, type ParsedRaceDetails } from "./raceSearchService";

export interface DiscoveryResult {
  source: string;
  discovered: number;
  imported: number;
  duplicates: number;
  failed: number;
}

/**
 * Automatically discovers and imports events from multiple sources
 * Uses RaceSearchService to find races on specific domains
 */
export class AutomaticEventDiscoveryService {
  private readonly raceSearchService = new RaceSearchService();

  /**
   * Discover and import events from target sources
   */
  async discoverAndImportEvents(): Promise<{
    ultrarunning: DiscoveryResult;
    runningInTheUSA: DiscoveryResult;
    total: {
      discovered: number;
      imported: number;
      duplicates: number;
      failed: number;
    };
  }> {
    console.log("Starting automatic event discovery...");

    const searchTerms = RaceSearchService.getGeorgiaSearchTerms();

    // Discover from UltraRunning.com
    console.log("Discovering from ultrarunning.com...");
    const ultrarunningEvents = await this.raceSearchService.discoverEventsFromSource(
      "ultrarunning.com",
      searchTerms
    );
    const ultrarunningResult = await this.importParsedEvents(
      ultrarunningEvents,
      "ultrarunning"
    );

    // Discover from RunningInTheUSA.com
    console.log("Discovering from runningintheusa.com...");
    const runningInTheUSAEvents = await this.raceSearchService.discoverEventsFromSource(
      "runningintheusa.com",
      searchTerms
    );
    const runningInTheUSAResult = await this.importParsedEvents(
      runningInTheUSAEvents,
      "runningintheuasa"
    );

    const total = {
      discovered: ultrarunningEvents.length + runningInTheUSAEvents.length,
      imported: ultrarunningResult.imported + runningInTheUSAResult.imported,
      duplicates: ultrarunningResult.duplicates + runningInTheUSAResult.duplicates,
      failed: ultrarunningResult.failed + runningInTheUSAResult.failed,
    };

    console.log(`Discovery complete: ${total.discovered} found, ${total.imported} imported`);

    return {
      ultrarunning: ultrarunningResult,
      runningInTheUSA: runningInTheUSAResult,
      total,
    };
  }

  /**
   * Import parsed race events to database with duplicate detection
   */
  private async importParsedEvents(
    events: ParsedRaceDetails[],
    source: string
  ): Promise<DiscoveryResult> {
    let imported = 0;
    let duplicates = 0;
    let failed = 0;

    for (const event of events) {
      try {
        // Check for duplicates using fuzzy matching
        const isDuplicate = await this.checkForDuplicate(event);

        if (isDuplicate) {
          duplicates++;
          continue;
        }

        // Skip if no date
        if (!event.date) {
          console.warn(`Skipping event with no date: ${event.name}`);
          failed++;
          continue;
        }

        // Skip past events
        if (event.date < new Date()) {
          console.warn(`Skipping past event: ${event.name}`);
          continue;
        }

        // Create unique source ID based on event details
        const sourceId = this.generateSourceId(event);

        // Create the event
        await db.event.create({
          data: {
            name: event.name || "Running Event",
            date: event.date,
            location: event.location || "Georgia",
            city: event.city || "Unknown",
            state: event.state ?? "GA",
            type: event.type ?? "Running Event",
            distance: event.distance ?? "Unknown",
            description: event.description,
            registrationLink: event.registrationLink,
            websiteUrl: event.websiteUrl,
            imageUrl: event.imageUrl,
            isVirtual: false,
            source,
            sourceId,
            isApproved: true, // Auto-approve scraped events from trusted sources
          },
        });

        imported++;
      } catch (error) {
        console.error(`Error importing event ${event.name}:`, error);
        failed++;
      }
    }

    return { source, discovered: events.length, imported, duplicates, failed };
  }

  /**
   * Check if event already exists using fuzzy matching
   */
  private async checkForDuplicate(event: ParsedRaceDetails): Promise<boolean> {
    if (!event.date || !event.city) {
      return false;
    }

    // First check for exact sourceId match (within same source)
    const sourceId = this.generateSourceId(event);
    const exactMatch = await db.event.findFirst({
      where: {
        sourceId,
      },
    });

    if (exactMatch) {
      return true;
    }

    // Fuzzy matching: same date (within 1 day), city, and similar name
    const dateFrom = new Date(event.date);
    dateFrom.setDate(dateFrom.getDate() - 1);

    const dateTo = new Date(event.date);
    dateTo.setDate(dateTo.getDate() + 1);

    const similarEvents = await db.event.findMany({
      where: {
        city: event.city,
        date: {
          gte: dateFrom,
          lte: dateTo,
        },
      },
    });

    // Check if any similar event has >= 80% name similarity
    const normalizedEventName = this.normalizeName(event.name);
    for (const similar of similarEvents) {
      const normalizedSimilarName = this.normalizeName(similar.name);
      const similarity = this.calculateSimilarity(normalizedEventName, normalizedSimilarName);

      if (similarity >= 0.8) {
        console.log(
          `Found similar event: "${event.name}" ~ "${similar.name}" (${similarity.toFixed(2)})`
        );
        return true;
      }
    }

    return false;
  }

  /**
   * Generate a unique source ID for the event
   */
  private generateSourceId(event: ParsedRaceDetails): string {
    // Use combination of event name, date, and city
    const date = event.date ? event.date.toISOString().split("T")[0] : "unknown";
    const name = this.normalizeName(event.name).substring(0, 30);
    const city = event.city?.substring(0, 10) || "unknown";

    return `${name}-${city}-${date}`;
  }

  /**
   * Normalize event name for comparison
   */
  private normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, " ") // Normalize spaces
      .trim();
  }

  /**
   * Calculate Levenshtein distance similarity (0 to 1)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = [];

    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1] ?? 0;
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j] ?? 0) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) {
        costs[s2.length] = lastValue;
      }
    }

    return costs[s2.length] ?? 0;
  }
}
