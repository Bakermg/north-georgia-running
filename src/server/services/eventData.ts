/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";

export interface RunSignUpEvent {
  race_id: number;
  name: string;
  description: string;
  url: string;
  next_date: string;
  next_end_date?: string;
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    zipcode: string;
    country_code: string;
  };
  is_registration_open: boolean;
  logo_url?: string;
}

// Improved XML parser for Node.js environment
function parseXML(xmlText: string) {
  const races: any[] = [];

  // Split by race elements
  const raceMatches = xmlText.match(/<race>[\s\S]*?<\/race>/g);

  if (!raceMatches) return { getElementsByTagName: () => races };

  for (const raceMatch of raceMatches) {
    const raceContent = raceMatch;
    const raceData: any = {};

    // Extract all tags from this race using a more precise approach
    // Remove the outer <race> tags first
    const innerContent = raceContent
      .replace(/^<race>/, "")
      .replace(/<\/race>$/, "");

    // Now find all individual tags
    const tagPattern = /<(\w+)>([^<]*?)<\/\1>/g;
    let tagMatch;

    while ((tagMatch = tagPattern.exec(innerContent)) !== null) {
      const tagName = tagMatch[1];
      let content = tagMatch[2] ?? "";

      // Clean up HTML entities
      content = content
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&#x27;/g, "'")
        .trim();

      if (tagName && content) {
        raceData[tagName] = content;
      }
    }

    // Handle address separately since it contains nested tags
    const addressMatch = /<address>([\s\S]*?)<\/address>/.exec(innerContent);
    if (addressMatch) {
      const addressContent = addressMatch[1];
      const addressData: any = {};

      const addressTagPattern = /<(\w+)>([^<]*?)<\/\1>/g;
      let addressTagMatch;

      while (
        (addressTagMatch = addressTagPattern.exec(addressContent ?? "")) !==
        null
      ) {
        const addressTagName = addressTagMatch[1];
        const addressContentInner = addressTagMatch[2] ?? "";
        if (addressTagName) {
          addressData[addressTagName] = addressContentInner
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'")
            .trim();
        }
      }

      raceData.address = addressData;
    }

    races.push(raceData);
  }

  return { getElementsByTagName: (tag: string) => races };
}

export class EventDataService {
  private readonly BASE_URL = "https://runsignup.com/Rest/races";

  async fetchGeorgiaRaces(): Promise<RunSignUpEvent[]> {
    try {
      const response = await fetch(`${this.BASE_URL}?state=GA&limit=500`);
      const xmlText = await response.text();

      // Parse XML response
      const xmlDoc = parseXML(xmlText);
      const races = xmlDoc.getElementsByTagName("race");

      const events: RunSignUpEvent[] = [];

      for (const race of races) {
        const getData = (tagName: string): string => {
          return race[tagName] ?? "";
        };

        const getAddressData = (tagName: string): string => {
          return race.address?.[tagName] ?? "";
        };

        const event: RunSignUpEvent = {
          race_id: parseInt(getData("race_id") || "0"),
          name: getData("name") ?? "",
          description: getData("description") ?? "",
          url: getData("url") ?? "",
          next_date: getData("next_date") ?? "",
          next_end_date: getData("next_end_date") ?? undefined,
          address: {
            street: getAddressData("street"),
            street2: getAddressData("street2"),
            city: getAddressData("city"),
            state: getAddressData("state"),
            zipcode: getAddressData("zipcode"),
            country_code: getAddressData("country_code"),
          },
          is_registration_open: getData("is_registration_open") === "T",
          logo_url: getData("logo_url") ?? undefined,
        };

        events.push(event);
      }

      return events;
    } catch (error) {
      console.error("Error fetching Georgia races:", error);
      return [];
    }
  }

  filterNorthGeorgiaEvents(events: RunSignUpEvent[]): RunSignUpEvent[] {
    return events.filter((event) => {
      const city = event.address.city.toLowerCase();
      const state = event.address.state;

      // Only include Georgia events
      if (state !== "GA") return false;

      // Include all Georgia events for now to maximize data
      return state === "GA";
    });
  }

  async importEventsToDatabase(): Promise<{
    imported: number;
    duplicates: number;
  }> {
    const events = await this.fetchGeorgiaRaces();
    const northGeorgiaEvents = this.filterNorthGeorgiaEvents(events);

    let imported = 0;
    let duplicates = 0;

    for (const event of northGeorgiaEvents) {
      try {
        // Check if event already exists
        const existingEvent = await db.event.findFirst({
          where: {
            sourceId: event.race_id.toString(),
          },
        });

        if (existingEvent) {
          duplicates++;
          continue;
        }

        // Parse date
        const eventDate = new Date(event.next_date);
        if (isNaN(eventDate.getTime())) {
          console.warn(
            `Invalid date for event ${event.name}: ${event.next_date}`,
          );
          continue;
        }

        await db.event.create({
          data: {
            name: event.name,
            date: eventDate,
            location: `${event.address.city}, ${event.address.state}`,
            city: event.address.city,
            state: event.address.state,
            type: this.extractEventType(event.name, event.description),
            distance: this.extractDistance(event.name, event.description),
            description: event.description,
            registrationLink: event.url,
            websiteUrl: event.url,
            imageUrl: event.logo_url,
            isVirtual: false,
            source: "runsignup",
            sourceId: event.race_id.toString(),
            isApproved: true, // RunSignUp events are auto-approved as they're from a trusted source
          },
        });

        imported++;
      } catch (error) {
        console.error(`Error importing event ${event.name}:`, error);
      }
    }

    return { imported, duplicates };
  }

  private extractEventType(name: string, description: string): string {
    const nameLower = name.toLowerCase();
    const descLower = description.toLowerCase();

    if (
      nameLower.includes("trail") ||
      descLower.includes("trail") ||
      nameLower.includes("mountain") ||
      descLower.includes("mountain") ||
      nameLower.includes("hiking") ||
      descLower.includes("hiking") ||
      nameLower.includes("off-road") ||
      descLower.includes("off-road")
    )
      return "Trail Run";
    if (nameLower.includes("ultra") || descLower.includes("ultra"))
      return "Ultra Marathon";
    if (nameLower.includes("marathon")) return "Marathon";
    if (nameLower.includes("half") || descLower.includes("half"))
      return "Half Marathon";
    if (nameLower.includes("10k") || descLower.includes("10k")) return "10K";
    if (nameLower.includes("5k") || descLower.includes("5k")) return "5K";
    if (nameLower.includes("virtual") || descLower.includes("virtual"))
      return "Virtual";

    return "Running Event";
  }

  private extractDistance(name: string, description: string): string {
    const nameLower = name.toLowerCase();
    const descLower = description.toLowerCase();

    // Extract distance from name first
    const distanceMatch = /(\d+(?:\.\d+)?\s*(k|km|miles?|mile))/.exec(
      nameLower,
    );
    if (distanceMatch) {
      return (
        distanceMatch[1] + (distanceMatch[2]?.includes("k") ? "K" : " miles")
      );
    }

    // Look for common distances in description
    if (nameLower.includes("5k") || descLower.includes("5k")) return "5K";
    if (nameLower.includes("10k") || descLower.includes("10k")) return "10K";
    if (nameLower.includes("half") || descLower.includes("half"))
      return "13.1 miles";
    if (nameLower.includes("marathon")) return "26.2 miles";

    return "Various";
  }

  async getEventsFromDatabase(filters?: {
    city?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: any = {};

    if (filters?.city) {
      where.city = { contains: filters.city };
    }

    if (filters?.type) {
      where.type = { contains: filters.type };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = filters.dateFrom;
      if (filters.dateTo) where.date.lte = filters.dateTo;
    }

    return db.event.findMany({
      where,
      orderBy: { date: "asc" },
    });
  }
}
