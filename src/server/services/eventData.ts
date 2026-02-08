/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment */
import { db } from "~/server/db";
import { AtlantaTrackClubService } from "./atlantaTrackClub";
import { ActiveApiService } from "./activeApi";

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

// North Georgia cities and counties for filtering
const NORTH_GEORGIA_CITIES = new Set([
  // Metro Atlanta
  "atlanta", "marietta", "alpharetta", "roswell", "johns creek",
  "sandy springs", "duluth", "lawrenceville", "gainesville", "canton",
  "woodstock", "kennesaw", "acworth", "cartersville", "cumming",
  "buford", "suwanee", "decatur", "brookhaven", "dunwoody",
  "smyrna", "mableton", "austell", "powder springs", "tucker",
  "stone mountain", "lilburn", "snellville", "loganville", "braselton",
  "flowery branch", "oakwood", "norcross", "peachtree corners",
  "johns creek", "milton", "ball ground", "holly springs",
  // North Georgia Mountains
  "dahlonega", "helen", "blue ridge", "ellijay", "cleveland",
  "clarkesville", "toccoa", "cornelia", "blairsville", "hiawassee",
  "young harris", "clayton", "dillard", "tallulah falls", "rabun gap",
  "jasper", "dawsonville", "suches", "morganton", "mineral bluff",
  "cherry log", "mccaysville", "copperhill", "east ellijay",
  // Northwest Georgia
  "rome", "dalton", "calhoun", "ringgold", "fort oglethorpe",
  "chickamauga", "lafayette", "summerville", "trion", "rockmart",
  "cedartown", "cave spring", "bremen", "temple", "villa rica",
  "dallas", "hiram", "douglasville",
]);

// Event type keywords for better categorization
const EVENT_TYPE_KEYWORDS = {
  "Trail Run": [
    "trail", "mountain", "hiking", "off-road", "offroad", "woods",
    "forest", "wilderness", "nature", "state park", "national forest",
    "appalachian", "cohutta", "chattahoochee", "blood mountain",
    "amicalola", "springer", "kennesaw mountain"
  ],
  "Ultra Marathon": [
    "ultra", "100k", "100 mile", "50k", "50 mile", "24 hour",
    "12 hour", "overnight", "endurance"
  ],
  "Marathon": ["marathon", "26.2"],
  "Half Marathon": ["half marathon", "half-marathon", "13.1"],
  "10K": ["10k", "10 k", "10km"],
  "5K": ["5k", "5 k", "5km"],
  "Relay": ["relay", "ragnar", "ekiden"],
  "Fun Run": ["fun run", "color run", "glow run", "beer run", "costume"],
  "Virtual": ["virtual", "anywhere", "own route"],
  "Obstacle": ["obstacle", "mud run", "spartan", "tough mudder", "warrior"],
  "Cross Country": ["cross country", "xc", "x-c"],
};

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
  private readonly atcService = new AtlantaTrackClubService();
  private readonly activeService = new ActiveApiService();

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

  /**
   * Check if a city is in North Georgia
   */
  isNorthGeorgiaCity(city: string): boolean {
    return NORTH_GEORGIA_CITIES.has(city.toLowerCase().trim());
  }

  /**
   * Filter events to North Georgia region
   * With improved city detection
   */
  filterNorthGeorgiaEvents(events: RunSignUpEvent[]): RunSignUpEvent[] {
    return events.filter((event) => {
      const city = event.address.city.toLowerCase().trim();
      const state = event.address.state;

      // Only include Georgia events
      if (state !== "GA") return false;

      // Check if it's a known North Georgia city
      if (this.isNorthGeorgiaCity(city)) return true;

      // For unknown cities, include all Georgia events for now
      // This ensures we don't miss any events
      return true;
    });
  }

  /**
   * Extract event type with improved categorization
   */
  private extractEventType(name: string, description: string): string {
    const nameLower = name.toLowerCase();
    const descLower = description.toLowerCase();
    const combined = `${nameLower} ${descLower}`;

    // Check each event type category
    for (const [eventType, keywords] of Object.entries(EVENT_TYPE_KEYWORDS)) {
      for (const keyword of keywords) {
        if (combined.includes(keyword)) {
          return eventType;
        }
      }
    }

    return "Running Event";
  }

  /**
   * Extract distance with improved parsing
   */
  private extractDistance(name: string, description: string): string {
    const nameLower = name.toLowerCase();
    const descLower = description.toLowerCase();
    const combined = `${nameLower} ${descLower}`;

    // Look for specific distance patterns
    const patterns = [
      // Ultra distances
      { regex: /100\s*(?:mile|mi)/i, value: "100 miles" },
      { regex: /100\s*k/i, value: "100K" },
      { regex: /50\s*(?:mile|mi)/i, value: "50 miles" },
      { regex: /50\s*k/i, value: "50K" },
      // Standard distances
      { regex: /marathon(?!\s*half)/i, value: "26.2 miles" },
      { regex: /half[- ]?marathon|13\.1/i, value: "13.1 miles" },
      { regex: /15\s*k/i, value: "15K" },
      { regex: /10\s*k/i, value: "10K" },
      { regex: /10\s*(?:mile|mi)/i, value: "10 miles" },
      { regex: /8\s*k/i, value: "8K" },
      { regex: /5\s*k/i, value: "5K" },
      { regex: /4\s*(?:mile|mi)/i, value: "4 miles" },
      { regex: /1\s*(?:mile|mi)(?!\w)/i, value: "1 mile" },
      // Metric
      { regex: /(\d+(?:\.\d+)?)\s*km/i, value: null }, // Dynamic handling below
    ];

    for (const { regex, value } of patterns) {
      if (regex.test(combined)) {
        if (value) return value;
        
        // Dynamic value extraction for km pattern
        const match = regex.exec(combined);
        if (match && match[1]) {
          return `${match[1]}K`;
        }
      }
    }

    // Generic distance extraction as fallback
    const genericMatch = /(\d+(?:\.\d+)?)\s*(k|km|miles?|mi)/i.exec(combined);
    if (genericMatch) {
      const num = genericMatch[1];
      const unit = genericMatch[2]?.toLowerCase();
      if (unit?.startsWith("k")) return `${num}K`;
      if (unit?.startsWith("mi")) return `${num} miles`;
    }

    return "Various";
  }

  /**
   * Import events from RunSignUp to the database
   */
  async importRunSignUpEvents(): Promise<{
    imported: number;
    duplicates: number;
  }> {
    const events = await this.fetchGeorgiaRaces();
    const filteredEvents = this.filterNorthGeorgiaEvents(events);

    let imported = 0;
    let duplicates = 0;

    for (const event of filteredEvents) {
      try {
        // Check if event already exists
        const existingEvent = await db.event.findFirst({
          where: {
            sourceId: event.race_id.toString(),
            source: "runsignup",
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

        // Skip past events
        if (eventDate < new Date()) {
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

  /**
   * Import all events from all sources
   */
  async importAllEvents(): Promise<{
    runsignup: { imported: number; duplicates: number };
    atc: { imported: number; duplicates: number };
    active: { imported: number; duplicates: number };
    total: { imported: number; duplicates: number };
  }> {
    console.log("Starting event import from all sources...");

    // Import from RunSignUp
    console.log("Importing from RunSignUp...");
    const runsignup = await this.importRunSignUpEvents();
    console.log(`RunSignUp: ${runsignup.imported} imported, ${runsignup.duplicates} duplicates`);

    // Import from Atlanta Track Club
    console.log("Importing from Atlanta Track Club...");
    const atc = await this.atcService.importEventsToDatabase();
    console.log(`ATC: ${atc.imported} imported, ${atc.duplicates} duplicates`);

    // Import from Active.com
    console.log("Importing from Active.com...");
    const active = await this.activeService.importEventsToDatabase();
    console.log(`Active.com: ${active.imported} imported, ${active.duplicates} duplicates`);

    const total = {
      imported: runsignup.imported + atc.imported + active.imported,
      duplicates: runsignup.duplicates + atc.duplicates + active.duplicates,
    };

    console.log(`Total: ${total.imported} imported, ${total.duplicates} duplicates`);

    return { runsignup, atc, active, total };
  }

  /**
   * Legacy method - imports to database (now calls importRunSignUpEvents)
   */
  async importEventsToDatabase(): Promise<{
    imported: number;
    duplicates: number;
  }> {
    return this.importRunSignUpEvents();
  }

  async getEventsFromDatabase(filters?: {
    city?: string;
    type?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: any = {
      isApproved: true,
    };

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

  /**
   * Get event statistics by source
   */
  async getEventStats(): Promise<{
    total: number;
    bySource: Record<string, number>;
    byType: Record<string, number>;
    upcoming: number;
  }> {
    const events = await db.event.findMany({
      where: { isApproved: true },
      select: { source: true, type: true, date: true },
    });

    const bySource: Record<string, number> = {};
    const byType: Record<string, number> = {};
    const now = new Date();
    let upcoming = 0;

    for (const event of events) {
      // Count by source
      const source = event.source || "unknown";
      bySource[source] = (bySource[source] || 0) + 1;

      // Count by type
      byType[event.type] = (byType[event.type] || 0) + 1;

      // Count upcoming
      if (event.date >= now) {
        upcoming++;
      }
    }

    return {
      total: events.length,
      bySource,
      byType,
      upcoming,
    };
  }
}
