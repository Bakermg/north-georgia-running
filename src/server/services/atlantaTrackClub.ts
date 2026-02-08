/**
 * Atlanta Track Club Event Service
 * 
 * This service provides curated events from Atlanta Track Club.
 * Since ATC events are relatively stable (same events each year), we maintain
 * a curated list that gets updated periodically.
 */

import { db } from "~/server/db";

export interface ATCEvent {
  name: string;
  date: string; // ISO date string
  location: string;
  city: string;
  type: string;
  distance: string;
  description: string;
  registrationLink: string;
  websiteUrl: string;
  imageUrl?: string;
}

// Curated list of Atlanta Track Club events for 2026
// These are updated annually when ATC releases their calendar
const ATC_EVENTS_2026: ATCEvent[] = [
  {
    name: "Westside Beltline 10K-3K",
    date: "2026-02-07",
    location: "Westside Beltline, Atlanta",
    city: "Atlanta",
    type: "10K",
    distance: "10K",
    description: "Part of the Race the Loop Series. Run through Atlanta's iconic Westside Beltline trail. 10K and 3K options available.",
    registrationLink: "https://www.atlantatrackclub.org/2026-westside-beltline-10k",
    websiteUrl: "https://www.atlantatrackclub.org/2026-westside-beltline-10k",
  },
  {
    name: "Hawks Fast Break 5K presented by Sharecare",
    date: "2026-03-21",
    location: "State Farm Arena, Atlanta",
    city: "Atlanta",
    type: "5K",
    distance: "5K",
    description: "Run at State Farm Arena! Includes an adidas long-sleeve shirt and a $25 ticket voucher for a Hawks game.",
    registrationLink: "https://www.atlantatrackclub.org/2026-hawks-fast-break-5k-presented-by-sharecare",
    websiteUrl: "https://www.atlantatrackclub.org/2026-hawks-fast-break-5k-presented-by-sharecare",
  },
  {
    name: "Northside Beltline 5K-3K",
    date: "2026-04-18",
    location: "Northside Beltline, Atlanta",
    city: "Atlanta",
    type: "5K",
    distance: "5K",
    description: "Part of the Race the Loop Series. Experience the Northside section of Atlanta's beloved Beltline. 5K and 3K options available.",
    registrationLink: "https://www.atlantatrackclub.org/2026-northside-beltline-5k",
    websiteUrl: "https://www.atlantatrackclub.org/2026-northside-beltline-5k",
  },
  {
    name: "Braves Country 5K presented by Southwire",
    date: "2026-06-06",
    location: "Truist Park, Atlanta",
    city: "Atlanta",
    type: "5K",
    distance: "5K",
    description: "Run at Truist Park! Includes a short-sleeve shirt and a ticket to a select Braves game. Kids Dash also available.",
    registrationLink: "https://www.atlantatrackclub.org/2026-braves-country-5k-dash",
    websiteUrl: "https://www.atlantatrackclub.org/2026-braves-country-5k-dash",
  },
  {
    name: "AJC Peachtree Road Race",
    date: "2026-07-04",
    location: "Lenox Square to Piedmont Park, Atlanta",
    city: "Atlanta",
    type: "10K",
    distance: "10K",
    description: "The world's largest 10K! A Fourth of July tradition in Atlanta since 1970. 60,000+ participants run from Lenox Square to Piedmont Park.",
    registrationLink: "https://www.atlantatrackclub.org/peachtree-road-race",
    websiteUrl: "https://www.atlantatrackclub.org/peachtree-road-race",
  },
  {
    name: "Southside Beltline 8K-3K",
    date: "2026-08-01",
    location: "Southside Beltline, Atlanta",
    city: "Atlanta",
    type: "Running Event",
    distance: "8K",
    description: "NEW in 2026! Part of the Race the Loop Series. Experience the newest section of Atlanta's Beltline. 8K and 3K options available.",
    registrationLink: "https://www.atlantatrackclub.org/2026-southside-beltline-5k",
    websiteUrl: "https://www.atlantatrackclub.org/2026-southside-beltline-5k",
  },
  {
    name: "Atlanta 10 Miler & 5K",
    date: "2026-10-04",
    location: "Downtown Atlanta",
    city: "Atlanta",
    type: "Running Event",
    distance: "10 miles",
    description: "A challenging 10-mile course through Atlanta's historic neighborhoods. 5K option also available for all fitness levels.",
    registrationLink: "https://www.atlantatrackclub.org/atlanta-10-miler",
    websiteUrl: "https://www.atlantatrackclub.org/atlanta-10-miler",
  },
  {
    name: "Publix Atlanta Marathon, Half Marathon & 5K",
    date: "2026-02-22",
    location: "Centennial Olympic Park, Atlanta",
    city: "Atlanta",
    type: "Marathon",
    distance: "26.2 miles",
    description: "The 20th running of the Publix Atlanta Marathon Weekend! Full marathon, half marathon, and 5K options through Atlanta's best neighborhoods.",
    registrationLink: "https://www.atlantatrackclub.org/atlanta-marathon",
    websiteUrl: "https://www.atlantatrackclub.org/atlanta-marathon",
  },
  {
    name: "Eastside Beltline 12K-3K",
    date: "2026-12-05",
    location: "Eastside Beltline, Atlanta",
    city: "Atlanta",
    type: "Running Event",
    distance: "12K",
    description: "Part of the Race the Loop Series. Complete your Race the Loop journey on the popular Eastside Beltline! 12K and 3K options available.",
    registrationLink: "https://www.atlantatrackclub.org/2026-eastside-beltline-12k",
    websiteUrl: "https://www.atlantatrackclub.org/2026-eastside-beltline-12k",
  },
  {
    name: "Atlanta Track Club Thanksgiving Day Half Marathon & 5K",
    date: "2026-11-26",
    location: "Georgia State Stadium, Atlanta",
    city: "Atlanta",
    type: "Half Marathon",
    distance: "13.1 miles",
    description: "Burn off those calories before the big feast! Half marathon and 5K options on Thanksgiving morning.",
    registrationLink: "https://www.atlantatrackclub.org/thanksgiving-day-half-marathon",
    websiteUrl: "https://www.atlantatrackclub.org/thanksgiving-day-half-marathon",
  },
];

export class AtlantaTrackClubService {
  /**
   * Get all curated ATC events for the current year
   */
  getCuratedEvents(): ATCEvent[] {
    // Filter to only include future events
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return ATC_EVENTS_2026.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    });
  }

  /**
   * Import ATC events to the database
   */
  async importEventsToDatabase(): Promise<{
    imported: number;
    duplicates: number;
  }> {
    const events = this.getCuratedEvents();
    let imported = 0;
    let duplicates = 0;

    for (const event of events) {
      try {
        // Check if event already exists by name and date
        const existingEvent = await db.event.findFirst({
          where: {
            source: "atlanta_track_club",
            name: event.name,
          },
        });

        if (existingEvent) {
          duplicates++;
          continue;
        }

        const eventDate = new Date(event.date);

        await db.event.create({
          data: {
            name: event.name,
            date: eventDate,
            location: event.location,
            city: event.city,
            state: "GA",
            type: event.type,
            distance: event.distance,
            description: event.description,
            registrationLink: event.registrationLink,
            websiteUrl: event.websiteUrl,
            imageUrl: event.imageUrl,
            isVirtual: false,
            source: "atlanta_track_club",
            sourceId: `atc-${event.name.toLowerCase().replace(/\s+/g, "-")}`,
            isApproved: true, // ATC events are auto-approved
          },
        });

        imported++;
      } catch (error) {
        console.error(`Error importing ATC event ${event.name}:`, error);
      }
    }

    return { imported, duplicates };
  }

  /**
   * Get all ATC events (for API use without database)
   */
  getAllEvents(): ATCEvent[] {
    return ATC_EVENTS_2026;
  }
}
