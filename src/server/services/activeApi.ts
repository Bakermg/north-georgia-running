/**
 * Active.com API Service
 * 
 * This service integrates with the Active.com Activity Search API v2
 * to fetch running events in Georgia.
 * 
 * Note: You need to register for an API key at https://developer.active.com/
 * and add it to your environment variables as ACTIVE_API_KEY
 */

import { db } from "~/server/db";
import { env } from "~/env";

export interface ActiveEvent {
  assetGuid: string;
  assetName: string;
  assetDescription?: string;
  activityStartDate: string;
  activityEndDate?: string;
  registrationUrlAdr?: string;
  homePageUrlAdr?: string;
  logoUrlAdr?: string;
  place: {
    placeName?: string;
    cityName?: string;
    stateProvinceCode?: string;
    postalCode?: string;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
  };
  assetCategories?: Array<{
    category: {
      categoryName: string;
    };
  }>;
  assetTopics?: Array<{
    topic: {
      topicName: string;
    };
  }>;
}

interface ActiveApiResponse {
  results: ActiveEvent[];
  total_results: number;
}

export class ActiveApiService {
  private readonly BASE_URL = "https://api.amp.active.com/v2/search";
  private readonly API_KEY: string | undefined;

  constructor() {
    // API key should be set in environment variables
    this.API_KEY = process.env.ACTIVE_API_KEY;
  }

  /**
   * Check if the API is configured
   */
  isConfigured(): boolean {
    return !!this.API_KEY;
  }

  /**
   * Fetch running events from Active.com for Georgia
   */
  async fetchGeorgiaRunningEvents(): Promise<ActiveEvent[]> {
    if (!this.API_KEY) {
      console.warn("Active.com API key not configured. Skipping Active.com import.");
      return [];
    }

    try {
      const params = new URLSearchParams({
        api_key: this.API_KEY,
        category: "event/activities/running",
        near: "Georgia,US",
        radius: "100",
        current_page: "1",
        per_page: "100",
        start_date: new Date().toISOString().split("T")[0]!,
        sort: "date_asc",
      });

      const response = await fetch(`${this.BASE_URL}?${params.toString()}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error("Active.com API: Invalid API key");
        } else if (response.status === 429) {
          console.error("Active.com API: Rate limit exceeded");
        } else {
          console.error(`Active.com API error: ${response.status}`);
        }
        return [];
      }

      const data = (await response.json()) as ActiveApiResponse;
      return data.results || [];
    } catch (error) {
      console.error("Error fetching Active.com events:", error);
      return [];
    }
  }

  /**
   * Filter events to North Georgia region
   */
  filterNorthGeorgiaEvents(events: ActiveEvent[]): ActiveEvent[] {
    const northGeorgiaCities = new Set([
      "atlanta", "marietta", "alpharetta", "roswell", "johns creek",
      "sandy springs", "duluth", "lawrenceville", "gainesville", "canton",
      "woodstock", "kennesaw", "acworth", "cartersville", "rome",
      "dalton", "dahlonega", "helen", "blue ridge", "ellijay",
      "cumming", "buford", "suwanee", "decatur", "brookhaven",
      "dunwoody", "smyrna", "mableton", "austell", "powder springs",
      "tucker", "stone mountain", "lilburn", "snellville", "loganville",
      "braselton", "flowery branch", "oakwood", "cleveland", "clarkesville",
      "toccoa", "cornelia", "blairsville", "hiawassee", "young harris",
    ]);

    return events.filter(event => {
      const city = event.place?.cityName?.toLowerCase() || "";
      const state = event.place?.stateProvinceCode?.toUpperCase() || "";
      
      // Only Georgia events
      if (state !== "GA") return false;
      
      // Include if city is in our North Georgia list
      return northGeorgiaCities.has(city);
    });
  }

  /**
   * Extract event type from Active.com categories/topics
   */
  private extractEventType(event: ActiveEvent): string {
    const name = event.assetName?.toLowerCase() || "";
    const description = event.assetDescription?.toLowerCase() || "";
    
    // Check topics and categories
    const topics = event.assetTopics?.map(t => t.topic.topicName.toLowerCase()) || [];
    const categories = event.assetCategories?.map(c => c.category.categoryName.toLowerCase()) || [];
    const allTags = [...topics, ...categories].join(" ");

    if (allTags.includes("trail") || name.includes("trail") || description.includes("trail")) {
      return "Trail Run";
    }
    if (allTags.includes("ultra") || name.includes("ultra") || description.includes("ultra")) {
      return "Ultra Marathon";
    }
    if (name.includes("marathon") && !name.includes("half")) {
      return "Marathon";
    }
    if (name.includes("half marathon") || name.includes("half-marathon")) {
      return "Half Marathon";
    }
    if (name.includes("10k") || name.includes("10 k")) return "10K";
    if (name.includes("5k") || name.includes("5 k")) return "5K";
    if (name.includes("virtual") || allTags.includes("virtual")) return "Virtual";

    return "Running Event";
  }

  /**
   * Extract distance from event name/description
   */
  private extractDistance(event: ActiveEvent): string {
    const name = event.assetName?.toLowerCase() || "";
    const description = event.assetDescription?.toLowerCase() || "";
    const combined = `${name} ${description}`;

    // Look for specific distances
    const distanceMatch = /(\d+(?:\.\d+)?)\s*(k|km|miles?|mile|mi)/.exec(combined);
    if (distanceMatch) {
      const num = distanceMatch[1];
      const unit = distanceMatch[2];
      if (unit?.startsWith("k")) return `${num}K`;
      if (unit?.startsWith("mi")) return `${num} miles`;
    }

    // Common distances
    if (name.includes("5k")) return "5K";
    if (name.includes("10k")) return "10K";
    if (name.includes("half")) return "13.1 miles";
    if (name.includes("marathon") && !name.includes("half")) return "26.2 miles";

    return "Various";
  }

  /**
   * Import Active.com events to the database
   */
  async importEventsToDatabase(): Promise<{
    imported: number;
    duplicates: number;
  }> {
    const events = await this.fetchGeorgiaRunningEvents();
    const filteredEvents = this.filterNorthGeorgiaEvents(events);

    let imported = 0;
    let duplicates = 0;

    for (const event of filteredEvents) {
      try {
        // Check if event already exists by source ID
        const existingEvent = await db.event.findFirst({
          where: {
            source: "active_com",
            sourceId: event.assetGuid,
          },
        });

        if (existingEvent) {
          duplicates++;
          continue;
        }

        const eventDate = new Date(event.activityStartDate);
        if (isNaN(eventDate.getTime())) {
          console.warn(`Invalid date for Active.com event: ${event.assetName}`);
          continue;
        }

        // Strip HTML from description
        const cleanDescription = event.assetDescription
          ?.replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .substring(0, 2000) || "";

        await db.event.create({
          data: {
            name: event.assetName || "Unnamed Event",
            date: eventDate,
            location: event.place?.placeName || `${event.place?.cityName || ""}, GA`,
            city: event.place?.cityName || "Unknown",
            state: "GA",
            type: this.extractEventType(event),
            distance: this.extractDistance(event),
            description: cleanDescription,
            registrationLink: event.registrationUrlAdr || event.homePageUrlAdr,
            websiteUrl: event.homePageUrlAdr,
            imageUrl: event.logoUrlAdr,
            isVirtual: false,
            source: "active_com",
            sourceId: event.assetGuid,
            isApproved: true, // Active.com events are auto-approved
          },
        });

        imported++;
      } catch (error) {
        console.error(`Error importing Active.com event ${event.assetName}:`, error);
      }
    }

    return { imported, duplicates };
  }
}
